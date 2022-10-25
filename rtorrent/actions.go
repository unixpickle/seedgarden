package rtorrent

// Start resumes a torrent.
func (c *Client) Start(hash string) error {
	return c.doAction("d.start", hash)
}

// Stop pauses a torrent.
func (c *Client) Stop(hash string) error {
	if err := c.doAction("d.stop", hash); err != nil {
		return err
	}
	return c.doAction("d.close", hash)
}

// Erase removes a torrent.
func (c *Client) Erase(hash string) error {
	return c.doAction("d.erase", hash)
}

// Add adds a torrent.
func (c *Client) Add(url string) error {
	return c.doAction("load.start", "", url)
}

// doAction performs a call with a single argument.
func (c *Client) doAction(action string, arguments ...string) error {
	_, err := c.Call(action, arguments...)
	return err
}
