package rarbg

import (
	"errors"
	"io"
	"net/http"
	"regexp"
	"strconv"
	"strings"

	"github.com/unixpickle/essentials"
	"github.com/unixpickle/seedgarden/bay"
	"github.com/yhat/scrape"
	"golang.org/x/net/html"
	"golang.org/x/net/html/atom"
)

var PeersRegexp = regexp.MustCompile("Seeders : ([0-9]*) , Leechers : ([0-9]*) =.*")

func (r RARBG) Lookup(id string) (result *bay.TorrentInfo, err error) {
	defer essentials.AddCtxTo("RARBG lookup", &err)
	lookupURL := "https://" + Domain + "/torrent/" + id
	resp, err := http.Get(lookupURL)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	return parseLookup(resp.Body)
}

func parseLookup(body io.Reader) (*bay.TorrentInfo, error) {
	root, err := html.Parse(body)
	if err != nil {
		return nil, err
	}

	result := bay.TorrentInfo{}

	title, ok := scrape.Find(root, scrape.ByTag(atom.H1))
	if !ok {
		return nil, errors.New("no title")
	}
	result.Name = strings.TrimSpace(scrape.Text(title))

	var infoTable *html.Node
	for _, elem := range scrape.FindAll(root, scrape.ByClass("lista")) {
		if elem.DataAtom == atom.Table {
			infoTable = elem
			break
		}
	}
	if infoTable == nil {
		return nil, errors.New("no info table found")
	}

	fields := map[string]string{}
	for _, row := range scrape.FindAll(infoTable, scrape.ByTag(atom.Tr)) {
		cols := scrape.FindAll(row, scrape.ByTag(atom.Td))
		if len(cols) != 2 {
			continue
		}
		key := strings.TrimSpace(scrape.Text(cols[0]))
		value := strings.TrimSpace(scrape.Text(cols[1]))
		fields[key] = value
	}

	result.Size = fields["Size:"]

	peersParsed := PeersRegexp.FindStringSubmatch(fields["Peers:"])
	if peersParsed != nil {
		result.Seeders, _ = strconv.Atoi(peersParsed[1])
		result.Leechers, _ = strconv.Atoi(peersParsed[2])
	}

	links := scrape.FindAll(infoTable, func(node *html.Node) bool {
		return node.DataAtom == atom.A &&
			strings.HasPrefix(scrape.Attr(node, "href"), "magnet:")
	})
	if len(links) == 0 {
		return nil, errors.New("no magnet URL")
	}
	result.MagnetURL = scrape.Attr(links[0], "href")

	return &result, nil
}
