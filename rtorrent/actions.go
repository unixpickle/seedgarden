package rtorrent

// Start resumes a torrent.
func (c *Client) Start(hash string) error {
	return c.doAction("d.start", hash)
}

// Stop pauses a torrent.
func (c *Client) Stop(hash string) error {
	return c.doAction("d.stop", hash)
}

// Erase removes a torrent.
func (c *Client) Erase(hash string) error {
	return c.doAction("d.erase", hash)
}

// doAction performs a call with a single argument.
func (c *Client) doAction(action, hash string) error {
	_, err := c.Call(action, hash)
	return err
}
