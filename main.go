package main

import (
	"encoding/json"
	"errors"
	"flag"
	"fmt"
	"log"
	"net/http"
	"net/url"
	"os"
	"path/filepath"
	"reflect"
	"strconv"
	"strings"
	"time"

	"github.com/unixpickle/essentials"
	"github.com/unixpickle/seedgarden/bay"
	"github.com/unixpickle/seedgarden/bay/piratebay"
	"github.com/unixpickle/seedgarden/bay/rarbg"
	"github.com/unixpickle/seedgarden/rtorrent"
	"github.com/unixpickle/seektar"
)

var GlobalClient *rtorrent.Client
var GlobalBay bay.Bay
var GlobalTitle string
var GlobalTimestampCache *KVCache[float64]

func main() {
	var addr string
	var rpcURL string
	var rpcUser string
	var rpcPass string
	var useRARBG bool
	var bayCacheTimeout time.Duration
	var pauseDoneInterval time.Duration
	var pauseRatio float64
	flag.StringVar(&addr, "addr", ":1337", "address to listen on")
	flag.StringVar(&rpcURL, "rpcurl", "", "URL for RPC backend")
	flag.StringVar(&rpcUser, "rpcuser", "", "username for RPC backend")
	flag.StringVar(&rpcPass, "rpcpass", "", "password for RPC backend")
	flag.BoolVar(&useRARBG, "rarbg", false, "use RARBG instead of TPB")
	flag.DurationVar(&bayCacheTimeout, "bay-cache-timeout", time.Minute*5, "timeout of bay cache")
	flag.StringVar(&GlobalTitle, "title", "Seedgarden", "title for HTML pages")
	flag.DurationVar(&pauseDoneInterval, "pause-interval", 0,
		"specify frequency at which finished downloads are checked and paused")
	flag.Float64Var(&pauseRatio, "pause-ratio", 1.0, "upload/download ratio to pause at")
	flag.Parse()

	if rpcURL == "" {
		essentials.Die("Missing -rpcurl flag. See -help.")
	}

	if useRARBG {
		GlobalBay = &rarbg.RARBG{}
	} else {
		GlobalBay = piratebay.PirateBay{}
	}
	GlobalBay = bay.NewCachedBay(GlobalBay, bayCacheTimeout, 100)
	GlobalClient = rtorrent.NewClientAuth(rpcURL, rpcUser, rpcPass)
	GlobalTimestampCache = NewKVCache[float64](1000)

	if pauseDoneInterval != 0 {
		go CheckPausedDownloadsLoop(pauseDoneInterval, pauseRatio)
	}

	http.HandleFunc("/", ServeSlash)
	http.HandleFunc("/api/downloads", ServeDownloads)
	http.HandleFunc("/api/start", ServeStart)
	http.HandleFunc("/api/stop", ServeStop)
	http.HandleFunc("/api/delete", ServeDelete)
	http.HandleFunc("/api/add", ServeAdd)
	http.HandleFunc("/api/baysearch", ServeBaySearch)
	http.HandleFunc("/api/baylookup", ServeBayLookup)
	http.HandleFunc("/api/files", ServeFiles)
	http.HandleFunc("/api/settimestamp", ServeSetTimestamp)
	http.HandleFunc("/api/download", ServeDownload)
	http.HandleFunc("/api/downloadall", ServeDownloadAll)

	http.ListenAndServe(addr, nil)
}

func CheckPausedDownloadsLoop(interval time.Duration, ratio float64) {
	for {
		nextTimer := time.After(interval)
		if err := checkPausedDownloads(ratio); err != nil {
			log.Println("error in pause loop:", err)
		}
		<-nextTimer
	}
}

func checkPausedDownloads(ratio float64) error {
	downloads, err := GlobalClient.Downloads()
	if err != nil {
		return err
	}
	for _, dl := range downloads {
		curRatio := float64(dl.UploadTotal) / float64(dl.SizeBytes)
		if dl.State != 0 && dl.CompletedBytes == dl.SizeBytes && curRatio >= ratio {
			log.Printf("automatically pausing download %s (%s, ratio %f)...",
				dl.Hash, dl.Name, curRatio)
			if err := GlobalClient.Stop(dl.Hash); err != nil {
				return err
			}
		}
	}
	return nil
}

func ServeSlash(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path == "/" || r.URL.Path == "" {
		data, err := Asset("assets/index.html")
		essentials.Must(err)
		homepage := strings.Replace(string(data), "PAGETITLE", GlobalTitle, -1)
		homepage = strings.Replace(homepage, "BAYSLANGNAME", GlobalBay.SlangName(), -1)
		w.Write([]byte(homepage))
	} else {
		server := http.FileServer(assetFS())
		server.ServeHTTP(w, r)
	}
}

func ServeDownloads(w http.ResponseWriter, r *http.Request) {
	if results, err := GlobalClient.Downloads(); err != nil {
		serveObject(w, err)
	} else {
		serveObject(w, results)
	}
}

func ServeStart(w http.ResponseWriter, r *http.Request) {
	if err := GlobalClient.Start(r.FormValue("hash")); err != nil {
		serveObject(w, err)
	} else {
		serveObject(w, "success")
	}
}

func ServeStop(w http.ResponseWriter, r *http.Request) {
	if err := GlobalClient.Stop(r.FormValue("hash")); err != nil {
		serveObject(w, err)
	} else {
		serveObject(w, "success")
	}
}

func ServeDelete(w http.ResponseWriter, r *http.Request) {
	listing, err := GlobalClient.Downloads()
	if err != nil {
		serveObject(w, err)
		return
	}
	for _, item := range listing {
		if item.Hash == r.FormValue("hash") {
			if err := GlobalClient.Erase(item.Hash); err != nil {
				serveObject(w, err)
				return
			}
			os.RemoveAll(item.Path())
			serveObject(w, "success")
		}
	}
}

func ServeAdd(w http.ResponseWriter, r *http.Request) {
	if err := GlobalClient.Add(r.FormValue("url")); err != nil {
		serveObject(w, err)
	} else {
		serveObject(w, "success")
	}
}

func ServeBaySearch(w http.ResponseWriter, r *http.Request) {
	if results, err := GlobalBay.Search(r.FormValue("query")); err != nil {
		serveObject(w, err)
	} else {
		serveObject(w, results)
	}
}

func ServeBayLookup(w http.ResponseWriter, r *http.Request) {
	if result, err := GlobalBay.Lookup(r.FormValue("id")); err != nil {
		serveObject(w, err)
	} else {
		serveObject(w, result)
	}
}

func ServeFiles(w http.ResponseWriter, r *http.Request) {
	item, err := findDownload(r.FormValue("hash"))
	if err != nil {
		serveObject(w, err)
		return
	}

	var results []map[string]interface{}
	err = filepath.Walk(item.Path(),
		func(path string, info os.FileInfo, err error) error {
			if err != nil {
				return err
			}
			if info.IsDir() {
				return nil
			}
			rel, err := filepath.Rel(item.Path(), path)
			if err != nil {
				return err
			}
			if rel == "." {
				rel = filepath.Base(path)
			}
			timestamp, ok := GlobalTimestampCache.Get(path)
			results = append(results, map[string]interface{}{
				"Link":         "/api/download?path=" + url.QueryEscape(path) + "&signature=" + Sign(path),
				"Path":         rel,
				"SetTimestamp": "/api/settimestamp?path=" + url.QueryEscape(path) + "&signature=" + Sign(path),
				"Timestamp":    timestamp,
				"HasTimestamp": ok,
			})
			return nil
		})
	if err != nil {
		serveObject(w, err)
	} else {
		serveObject(w, results)
	}
}

func ServeSetTimestamp(w http.ResponseWriter, r *http.Request) {
	path := r.FormValue("path")
	signature := r.FormValue("signature")
	if Sign(path) != signature {
		serveObject(w, errors.New("bad signature"))
		return
	}
	ts, err := strconv.ParseFloat(r.FormValue("timestamp"), 64)
	if err != nil {
		serveObject(w, fmt.Errorf("failed to parse timestamp: %s", err.Error()))
		return
	}
	GlobalTimestampCache.Set(path, ts)
	serveObject(w, ts)
}

func ServeDownload(w http.ResponseWriter, r *http.Request) {
	path := r.FormValue("path")
	signature := r.FormValue("signature")
	if Sign(path) != signature {
		serveObject(w, errors.New("bad signature"))
		return
	}
	serveFile(w, r, path)
}

func ServeDownloadAll(w http.ResponseWriter, r *http.Request) {
	item, err := findDownload(r.FormValue("hash"))
	if err != nil {
		serveObject(w, err)
		return
	}

	if stat, err := os.Stat(item.Path()); err != nil {
		serveObject(w, err)
		return
	} else if !stat.IsDir() {
		serveFile(w, r, item.Path())
		return
	}

	tarball, err := seektar.Tar(item.Path(), filepath.Base(item.Path()))
	if err != nil {
		serveObject(w, err)
		return
	}

	filename := filepath.Base(item.Path()) + ".tar"

	f, err := tarball.Open()
	if err != nil {
		serveObject(w, err)
		return
	}
	defer f.Close()
	w.Header().Set("Content-Disposition", dispositionHeader(filename))
	http.ServeContent(w, r, filename, time.Time{}, f)
}

func serveFile(w http.ResponseWriter, r *http.Request, path string) {
	f, err := os.Open(path)
	if err != nil {
		serveObject(w, err)
		return
	}
	defer f.Close()
	w.Header().Set("Content-Disposition", dispositionHeader(filepath.Base(path)))
	http.ServeContent(w, r, filepath.Base(path), time.Time{}, f)
}

func dispositionHeader(filename string) string {
	return "attachment; filename*=UTF-8''" + url.PathEscape(filename)
}

func findDownload(hash string) (*rtorrent.Download, error) {
	listing, err := GlobalClient.Downloads()
	if err != nil {
		return nil, err
	}
	for _, item := range listing {
		if item.Hash == hash {
			return item, nil
		}
	}
	return nil, errors.New("download not found")
}

func serveObject(w http.ResponseWriter, obj interface{}) {
	if err, ok := obj.(error); ok {
		obj = map[string]string{"error": err.Error()}
	}

	// Don't send null for empty slices.
	if obj != nil && reflect.TypeOf(obj).Kind() == reflect.Slice {
		if reflect.ValueOf(obj).Len() == 0 {
			obj = reflect.MakeSlice(reflect.TypeOf(obj), 0, 0).Interface()
		}
	}

	data, _ := json.Marshal(obj)
	w.Write(data)
}
