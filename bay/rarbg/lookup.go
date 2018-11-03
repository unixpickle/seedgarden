package rarbg

import (
	"encoding/base64"
	"encoding/json"

	"github.com/unixpickle/essentials"
	"github.com/unixpickle/seedgarden/bay"
)

func (r *RARBG) Lookup(id string) (result *bay.TorrentInfo, err error) {
	defer essentials.AddCtxTo("RARBG lookup", &err)
	jsonData, err := base64.RawURLEncoding.DecodeString(id)
	if err != nil {
		return nil, err
	}
	err = json.Unmarshal(jsonData, &result)
	return
}
