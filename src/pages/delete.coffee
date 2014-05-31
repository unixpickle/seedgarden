Page = require './page'
Session = require '../session'
url = require 'url'

class Delete extends Page
  constructor: -> super()

  path: -> '/delete'

  get: (req, res) ->
    if not req.session.userInfo?
      return res.redirect 'login'
    if typeof req.query.hash isnt 'string'
      return @error res, 'invalid hash parameter'
    session = new Session req.session.userInfo
    session.lookupDownload req.query.hash, (err, info) =>
      if err?
        session.end()
        return @error res, err.toString()
      @removeTorrent res, session, info

  removeTorrent: (res, session, info) ->
    session.rpc.doAction 'd.erase', info.dl.hash, (err) =>
      if err?
        session.end()
        return @error res, err.toString() 
      @removeFile res, session, info

  removeFile: (res, session, info) ->
    res.redirect './'
    if not info.path?
      return session.end()
    session.getFTP (err, ftp) =>
      throw err if err?
      ftp.rmdir = require '../rmdir'
      ftp.rmdir info.path, (err) =>
        session.end()


module.exports = Delete
