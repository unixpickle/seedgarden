package rarbg

import (
	"errors"
	"io"
	"net/http"
	"net/url"
	"strings"

	"github.com/unixpickle/essentials"
	"github.com/unixpickle/seedgarden/bay"
	"github.com/yhat/scrape"
	"golang.org/x/net/html"
	"golang.org/x/net/html/atom"
)

func (r RARBG) Search(query string) (results []*bay.SearchResult, err error) {
	defer essentials.AddCtxTo("RARBG search", &err)
	escapedQuery := url.QueryEscape(query)
	searchURL := "https://" + Domain + "/torrents.php?search=" + escapedQuery
	resp, err := http.Get(searchURL)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	return parseSearch(resp.Body)
}

func parseSearch(body io.Reader) ([]*bay.SearchResult, error) {
	root, err := html.Parse(body)
	if err != nil {
		return nil, err
	}

	resultElems := scrape.FindAll(root, scrape.ByClass("lista2"))
	results := []*bay.SearchResult{}
	for _, resultElem := range resultElems {
		cols := scrape.FindAll(resultElem, scrape.ByTag(atom.Td))
		if len(cols) < 4 {
			return nil, errors.New("missing a column in result table")
		}
		torrentLink, ok := scrape.Find(cols[1], scrape.ByTag(atom.A))
		if !ok {
			return nil, errors.New("missing title link")
		}
		title := strings.TrimSpace(scrape.Text(torrentLink))
		href := scrape.Attr(torrentLink, "href")
		size := strings.TrimSpace(scrape.Text(cols[3]))

		comps := strings.Split(href, "/")
		if len(comps) != 3 {
			return nil, errors.New("unexpected torrent link format")
		}
		id := comps[2]

		results = append(results, &bay.SearchResult{
			Name: title,
			ID:   id,
			Size: size,
		})
	}

	return results, nil
}
