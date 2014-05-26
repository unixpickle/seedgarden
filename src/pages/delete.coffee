Page = require './page'
Client = require '../client'
ftp = require 'ftp'
url = require 'url'

class Delete extends Page
  constructor: -> super()
  
  path: -> '/delete'
  
  redError: (res, msg) ->
    res.redirect './?error=' + encodeURIComponent msg
  
  get: (req, res) ->
    if not req.session.userInfo?
      return res.redirect 'login'
    if typeof req.query.hash isnt 'string'
      return @redError res, 'invalid hash parameter'
    {rpcurl, username, password} = req.session.userInfo
    client = new Client rpcurl, username, password
    res.rpcClient = client
    client.getDownloads (err, list) =>
      return @redError res, 'failed to list' if err?
      dl = null
      for x in list
        if x.hash is req.query.hash
          dl = x
          break
      if not dl?
        return @redError res, 'torrent does not exist'
      res.dl = dl
      @removeDownload req, res
  
  removeDownload: (req, res) ->
    # remove the torrent first
    res.rpcClient.doAction 'd.erase', res.dl.hash, (err) =>
      if err?
        return @redError res, 'failed to erase the download'
      client = new ftp()
      client.on 'ready', => @deleteFiles res, client
      client.on 'error', (e) =>
        @redError res, 'FTP error: ' + e.toString()
      {rpcurl, username, password} = req.session.userInfo
      client.connect
        host: url.parse(rpcurl).hostname
        user: username
        password: password

  deleteFiles: (res, client) ->
    client.rmdir = require '../rmdir'
    client.rmdir res.dl.basePath, (err) =>
      return res.redirect './' if not err?
      aPath = res.dl.basePath.replace /^\/home\/[a-z]*\//, '/'
      client.rmdir aPath, (err) =>
        return @redError res, err.toString() if err?
        res.redirect './'
          

module.exports = Delete
