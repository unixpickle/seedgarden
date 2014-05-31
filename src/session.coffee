Client = require './Client'
ftp = require 'ftp'
url = require 'url'

class Session
  constructor: (userInfo) ->
    {@rpcurl, @username, @password} = userInfo
    @ftp = null
    @rpc = new Client @rpcurl, @username, @password
    @connecting = false
  
  getFTP: (cb) ->
    if @connecting
      throw new Error 'already attempting to connect'
    if @ftp?
      return cb null, @ftp
    @connecting = true
    @ftp = new ftp()
    failCb = (err) =>
      @ftp = null
      @connecting = false
      cb err
    @ftp.once 'ready', =>
      @connecting = false
      @ftp.removeListener 'error', failCb
      cb null, @ftp
    @ftp.once 'error', failCb
    @ftp.connect
      host: url.parse(@rpcurl).hostname
      user: @username
      password: @password
  
  lookupDownload: (hash, cb) ->
    @rpc.getDownloads (err, list) =>
      return cb err if err?
      dl = null
      for x in list
        if x.hash is hash
          dl = x
          break
      if not dl?
        return cb new Error 'no torrent found with hash "' + hash | '"'
      @_lookupDlPath dl, cb
  
  end: ->
    @ftp?.end()
  
  _lookupDlPath: (dl, cb) ->
    # attempt to locate the torrent's path on the FTP server; first try
    # stripping the home directory, then try the full path.
    if dl.basePath.length is 0
      return cb null, {dl: dl, path: null}
    aPath = dl.basePath.replace /^\/home\/[a-zA-Z0-9]*\//, '/'
    @getFTP (err, ftp) ->
      return cb err if err?
      ftp.list aPath, (err) ->
        return cb null, {dl: dl, path: aPath} if not err?
        ftp.list dl.basePath, (err) ->
          if err?
            cb null, {dl: dl, path: null}
          else
            cb null, {dl: dl, path: dl.basePath}


module.exports = Session
