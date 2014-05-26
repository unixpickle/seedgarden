Page = require './page'
Client = require '../client'
url = require 'url'

class Home extends Page
  constructor: -> super()
  
  path: -> '/'
  
  get: (req, res) ->
    res.header 'Cache-Control', 'no-cache, no-store, must-revalidate'
    res.header 'Pragma', 'no-cache'
    res.header 'Expires', '0'
    
    if not req.session.userInfo?
      return res.redirect 'login'
    {rpcurl, username, password} = req.session.userInfo
    view =
      server: url.parse(rpcurl).hostname
      rpcurl: rpcurl
      username: username
    if typeof req.query.error is 'string'
      view.error = req.query.error
    client = new Client rpcurl, username, password
    client.getDownloads (err, downloads) =>
      if err?
        view.error = err.toString()
        view.downloads = []
      else
        view.downloads = (x.toClientJSON() for x in downloads)
      @template res, 'home.mustache', view

module.exports = Home
