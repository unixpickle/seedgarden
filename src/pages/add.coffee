Page = require './page'
Client = require '../client'

class Add extends Page
  constructor: -> super()
  
  path: -> '/add'
  
  get: (req, res) ->
    if not req.session.userInfo?
      return res.redirect 'login'
    @template res, 'add.mustache', {}
  
  post: (req, res) ->
    if not req.session.userInfo?
      return res.redirect 'login'
    {rpcurl, username, password} = req.session.userInfo
    @postArgs req, ['magnet-url'], (err, fields) ->
      return res.send 400, err.toString() if err?
      client = new Client rpcurl, username, password
      client.addTorrent fields['magnet-url'], (theErr) ->
        if theErr?
          res.redirect './?error=error%20adding%20torrent'
        else
          res.redirect './'

module.exports = Add
