package bay

import (
	"sync"
	"time"
)

// A CachedBay wraps a Bay with a short-term cache.
//
// This can speed up page refreshes and browser navigation.
type CachedBay struct {
	Bay

	queryCache  *cache
	lookupCache *cache
}

// NewCachedBay creates a CachedBay wrapping b.
func NewCachedBay(b Bay, timeout time.Duration, maxSize int) *CachedBay {
	return &CachedBay{
		Bay:         b,
		queryCache:  newCache(timeout, maxSize),
		lookupCache: newCache(timeout, maxSize),
	}
}

func (c *CachedBay) Search(query string) ([]*SearchResult, error) {
	if result, ok := c.queryCache.Lookup(query); ok {
		return result.([]*SearchResult), nil
	}
	if result, err := c.Bay.Search(query); err == nil {
		c.queryCache.Store(query, result)
		return result, nil
	} else {
		return nil, err
	}
}

func (c *CachedBay) Lookup(id string) (*TorrentInfo, error) {
	if result, ok := c.lookupCache.Lookup(id); ok {
		return result.(*TorrentInfo), nil
	}
	if result, err := c.Bay.Lookup(id); err == nil {
		c.lookupCache.Store(id, result)
		return result, nil
	} else {
		return nil, err
	}
}

type cache struct {
	timeout time.Duration
	maxSize int

	lock  sync.Mutex
	items map[string]*cacheItem
}

func newCache(timeout time.Duration, maxSize int) *cache {
	return &cache{
		timeout: timeout,
		maxSize: maxSize,
		items:   map[string]*cacheItem{},
	}
}

func (c *cache) Lookup(key string) (interface{}, bool) {
	c.lock.Lock()
	defer c.lock.Unlock()
	now := time.Now()
	if entry, ok := c.items[key]; ok {
		if now.After(entry.Expiry) {
			delete(c.items, key)
			return nil, false
		}
		return entry.Data, true
	}
	return nil, false
}

func (c *cache) Store(key string, data interface{}) {
	c.lock.Lock()
	defer c.lock.Unlock()

	// Attempt to clean up memory even if it's not strictly
	// necessary to remain under maxSize.
	c.deleteExpired()

	if len(c.items) == c.maxSize {
		// Delete the cache entry that will expire the
		// soonest, even though it's not expired yet.
		var earliestKey string
		var earliestExpiry time.Time
		var first bool
		for key, item := range c.items {
			if first || item.Expiry.Before(earliestExpiry) {
				earliestExpiry = item.Expiry
				earliestKey = key
				first = false
			}
		}
		delete(c.items, earliestKey)
	}

	c.items[key] = &cacheItem{
		Data:   data,
		Expiry: time.Now().Add(c.timeout),
	}
}

func (c *cache) deleteExpired() {
	now := time.Now()
	var keys []string
	for key, item := range c.items {
		if now.After(item.Expiry) {
			keys = append(keys, key)
		}
	}
	for _, key := range keys {
		delete(c.items, key)
	}
}

type cacheItem struct {
	Data   interface{}
	Expiry time.Time
}
