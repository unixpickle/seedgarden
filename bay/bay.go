package bay

// A Bay is a searchable database of torrents.
type Bay interface {
	Search(query string) ([]*SearchResult, error)
	Lookup(id string) (*TorrentInfo, error)
}

// TorrentInfo stores detailed information about a single
// torrent on a bay.
type TorrentInfo struct {
	Name      string
	Seeders   int
	Leechers  int
	Size      string
	MagnetURL string
}

// SearchResult stores general information about a torrent
// on a bay.
type SearchResult struct {
	Name string
	ID   string
	Size string
}
