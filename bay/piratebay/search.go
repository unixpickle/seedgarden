package piratebay

import (
	"io"
	"net/http"
	"net/url"
	"regexp"
	"strings"

	"github.com/unixpickle/essentials"
	"github.com/unixpickle/seedgarden/bay"
	"github.com/yhat/scrape"
	"golang.org/x/net/html"
	"golang.org/x/net/html/atom"
)

var sizeRegexp = regexp.MustCompile("Size ([^,]*),")

func (p PirateBay) Search(query string) (results []*bay.SearchResult, err error) {
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

func parseSearch(body io.Reader) ([]*bay.SearchResult, error) {
	root, err := html.Parse(body)
	if err != nil {
		return nil, err
	}

	resultElems := scrape.FindAll(root, scrape.ByClass("detName"))
	results := []*bay.SearchResult{}
	for _, resultElem := range resultElems {
		link, ok := scrape.Find(resultElem, scrape.ByTag(atom.A))
		if ok {
			href := scrape.Attr(link, "href")
			title := scrape.Text(link)
			parts := strings.Split(href, "/")
			if len(parts) < 3 {
				continue
			}
			result := &bay.SearchResult{Name: title, ID: parts[2]}
			desc, ok := scrape.Find(resultElem.Parent, scrape.ByClass("detDesc"))
			if ok {
				match := sizeRegexp.FindStringSubmatch(scrape.Text(desc))
				if match != nil {
					result.Size = match[1]
				}
			}
			results = append(results, result)
		}
	}

	return results, nil
}
