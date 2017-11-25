package piratebay

import (
	"io"
	"net/http"
	"net/url"
	"strings"

	"github.com/unixpickle/essentials"
	"github.com/yhat/scrape"
	"golang.org/x/net/html"
	"golang.org/x/net/html/atom"
)

type SearchResult struct {
	Name string
	ID   string
}

func Search(query string) (results []*SearchResult, err error) {
	defer essentials.AddCtxTo("piratebay search", &err)
	escapedQuery := url.QueryEscape(query)
	searchURL := "https://" + Domain + "/search/" + escapedQuery + "/0/99/0"
	resp, err := http.Get(searchURL)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	return parseSearch(resp.Body)
}

func parseSearch(body io.Reader) ([]*SearchResult, error) {
	root, err := html.Parse(body)
	if err != nil {
		return nil, err
	}

	resultElems := scrape.FindAll(root, scrape.ByClass("detName"))
	results := []*SearchResult{}
	for _, resultElem := range resultElems {
		link, ok := scrape.Find(resultElem, scrape.ByTag(atom.A))
		if ok {
			href := scrape.Attr(link, "href")
			title := scrape.Text(link)
			parts := strings.Split(href, "/")
			if len(parts) >= 3 {
				results = append(results, &SearchResult{Name: title, ID: parts[2]})
			}
		}
	}

	return results, nil
}
