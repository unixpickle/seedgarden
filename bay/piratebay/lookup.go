package piratebay

import (
	"errors"
	"io"
	"net/http"
	"strconv"
	"strings"

	"github.com/unixpickle/essentials"
	"github.com/unixpickle/seedgarden/bay"
	"github.com/yhat/scrape"
	"golang.org/x/net/html"
	"golang.org/x/net/html/atom"
)

func (p PirateBay) Lookup(id string) (result *bay.TorrentInfo, err error) {
	defer essentials.AddCtxTo("piratebay lookup", &err)
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
	title, ok := scrape.Find(root, scrape.ById("title"))
	if !ok {
		return nil, errors.New("no title")
	}
	result.Name = strings.TrimSpace(scrape.Text(title))

	details, ok := scrape.Find(root, scrape.ById("details"))
	if !ok {
		return nil, errors.New("no details")
	}
	fieldNames := scrape.FindAll(details, scrape.ByTag(atom.Dt))
	fieldValues := scrape.FindAll(details, scrape.ByTag(atom.Dd))
	fields := map[string]string{}
	for i := 0; i < len(fieldNames) && i < len(fieldValues); i++ {
		key := strings.TrimSpace(scrape.Text(fieldNames[i]))
		value := strings.TrimSpace(scrape.Text(fieldValues[i]))
		fields[key] = value
	}

	result.Seeders, err = strconv.Atoi(fields["Seeders:"])
	if err != nil {
		return nil, errors.New("invalid seeders")
	}
	result.Leechers, err = strconv.Atoi(fields["Leechers:"])
	if err != nil {
		return nil, errors.New("invalid leechers")
	}
	result.Size = fields["Size:"]

	links := scrape.FindAll(details, func(node *html.Node) bool {
		return node.DataAtom == atom.A &&
			strings.HasPrefix(scrape.Attr(node, "href"), "magnet:")
	})
	if len(links) == 0 {
		return nil, errors.New("no magnet URL")
	}
	result.MagnetURL = scrape.Attr(links[0], "href")

	return &result, nil
}
