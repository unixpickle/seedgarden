package rarbg

import (
	"encoding/base64"
	"encoding/json"

	humanize "github.com/dustin/go-humanize"
	"github.com/unixpickle/essentials"
	"github.com/unixpickle/seedgarden/bay"
)

type searchResult struct {
	Title    string `json:"title"`
	Download string `json:"download"`
	Seeders  int    `json:"seeders"`
	Leechers int    `json:"leechers"`
	Size     uint64 `json:"size"`
}

func (r *RARBG) Search(query string) (results []*bay.SearchResult, err error) {
	defer essentials.AddCtxTo("RARBG search", &err)
	params := map[string]string{
		"mode":          "search",
		"search_string": query,
		"format":        "json_extended",
	}
	var rawResults struct {
		Results []*searchResult `json:"torrent_results"`
	}
	if err := r.makeRequest(params, &rawResults); err != nil {
		return nil, err
	}
	for _, result := range rawResults.Results {
		results = append(results, &bay.SearchResult{
			Name: result.Title,
			ID:   encodeID(result),
			Size: humanize.IBytes(result.Size),
		})
	}
	return
}

func encodeID(result *searchResult) string {
	info := &bay.TorrentInfo{
		Name:      result.Title,
		Seeders:   result.Seeders,
		Leechers:  result.Leechers,
		Size:      humanize.IBytes(result.Size),
		MagnetURL: result.Download,
	}
	data, _ := json.Marshal(info)
	return base64.RawURLEncoding.EncodeToString(data)
}
