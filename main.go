package main

import (
	"encoding/json"
	"flag"
	"net/http"

	"github.com/unixpickle/essentials"
	"github.com/unixpickle/seedgarden/piratebay"
	"github.com/unixpickle/seedgarden/rtorrent"
)

var GlobalClient *rtorrent.Client

func main() {
	var addr string
	var rpcURL string
	var rpcUser string
	var rpcPass string
	flag.StringVar(&addr, "addr", ":1337", "address to listen on")
	flag.StringVar(&rpcURL, "rpcurl", "", "URL for RPC backend")
	flag.StringVar(&rpcUser, "rpcuser", "", "username for RPC backend")
	flag.StringVar(&rpcPass, "rpcpass", "", "password for RPC backend")
	flag.Parse()

	if rpcURL == "" {
		essentials.Die("Missing -rpcurl flag. See -help.")
	}

	GlobalClient = rtorrent.NewClientAuth(rpcURL, rpcUser, rpcPass)

	http.Handle("/", http.FileServer(assetFS()))
	http.HandleFunc("/api/downloads", ServeDownloads)
	http.HandleFunc("/api/start", ServeStart)
	http.HandleFunc("/api/stop", ServeStop)
	http.HandleFunc("/api/delete", ServeDelete)
	http.HandleFunc("/api/add", ServeAdd)
	http.HandleFunc("/api/baysearch", ServeBaySearch)
	http.HandleFunc("/api/baylookup", ServeBayLookup)

	http.ListenAndServe(addr, nil)
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
	// TODO: this is commented out for safety.
	serveObject(w, "success")
	// listing, err := GlobalClient.Downloads()
	// if err != nil {
	// 	serveObject(w, err)
	// 	return
	// }
	// for _, item := range listing {
	// 	if item.Hash == r.FormValue("hash") {
	// 		if err := GlobalClient.Erase(item.Hash); err != nil {
	// 			serveObject(w, err)
	// 			return
	// 		}
	// 		os.RemoveAll(item.BasePath)
	// 		serveObject(w, "success")
	// 	}
	// }
}

func ServeAdd(w http.ResponseWriter, r *http.Request) {
	if err := GlobalClient.Add(r.FormValue("url")); err != nil {
		serveObject(w, err)
	} else {
		serveObject(w, nil)
	}
}

func ServeBaySearch(w http.ResponseWriter, r *http.Request) {
	if results, err := piratebay.Search(r.FormValue("query")); err != nil {
		serveObject(w, err)
	} else {
		serveObject(w, results)
	}
}

func ServeBayLookup(w http.ResponseWriter, r *http.Request) {
	if result, err := piratebay.Lookup(r.FormValue("id")); err != nil {
		serveObject(w, err)
	} else {
		serveObject(w, result)
	}
}

func serveObject(w http.ResponseWriter, obj interface{}) {
	if err, ok := obj.(error); ok {
		obj = map[string]string{"error": err.Error()}
	}
	data, _ := json.Marshal(obj)
	w.Write(data)
}
