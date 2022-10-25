package rtorrent

import (
	"encoding/xml"
	"errors"

	"github.com/unixpickle/essentials"
)

// A Download contains information about a torrent in the
// client.
type Download struct {
	Hash           string
	Directory      string
	BasePath       string
	BaseFilename   string
	CompletedBytes int64
	SizeBytes      int64
	Name           string
	UploadRate     int64
	DownloadRate   int64
	UploadTotal    int64
	DownloadTotal  int64
	State          int
}

// Path gets the path to the downloaded torrent.
func (c *Download) Path() string {
	if c.BasePath != "" {
		return c.BasePath
	}
	return c.Directory
}

// Downloads lists all the downloads in the client.
func (c *Client) Downloads() (downloads []*Download, err error) {
	defer essentials.AddCtxTo("get downloads", &err)
	body, err := c.Call("d.multicall2", "", "main", "d.hash=", "d.directory=",
		"d.base_path=", "d.base_filename=", "d.completed_bytes=", "d.size_bytes=",
		"d.name=", "d.up.rate=", "d.down.rate=", "d.up.total=", "d.down.total=",
		"d.state=")
	if err != nil {
		return nil, err
	}
	var resp methodResponse
	if err := xml.Unmarshal(body, &resp); err != nil {
		return nil, err
	}
	for _, download := range resp.Downloads {
		if len(download.Values) != 12 {
			return nil, errors.New("unexpected number of values")
		}
		downloads = append(downloads, &Download{
			Hash:           download.Values[0].String,
			Directory:      download.Values[1].String,
			BasePath:       download.Values[2].String,
			BaseFilename:   download.Values[3].String,
			CompletedBytes: download.Values[4].Int,
			SizeBytes:      download.Values[5].Int,
			Name:           download.Values[6].String,
			UploadRate:     download.Values[7].Int,
			DownloadRate:   download.Values[8].Int,
			UploadTotal:    download.Values[9].Int,
			DownloadTotal:  download.Values[10].Int,
			State:          int(download.Values[11].Int),
		})
	}
	return downloads, nil
}

type methodResponse struct {
	Downloads []downloadInfo `xml:"params>param>value>array>data>value"`
}

type downloadInfo struct {
	Values []downloadValue `xml:"array>data>value"`
}

type downloadValue struct {
	String string `xml:"string"`
	Int    int64  `xml:"i8"`
}
