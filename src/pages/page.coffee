fs = require 'fs'
mustache = require 'mustache'
Busboy = require 'busboy'

class Page
  constructor: ->
  
  path: -> throw new Error 'Page::path() is a pure virtual method'
  
  get: (req, res) -> @template res, '404.mustache', {}, 404
  
  post: (req, res) -> @template res, '404.mustache', {}, 404
  
  template: (res, name, view, status = 200) ->
    fs.readFile 'templates/' + name, (err, data) ->
      return res.send 500, 'Failed to read templates/' + name if err?
      try
        output = mustache.render data.toString(), view
      catch e
        return res.send 500, 'Failed to render view: ' + e.toString()
      res.send status, output
  
  postArgs: (req, names, cb) ->
    try
      bb = new Busboy headers: req.headers
    catch e
      return cb e
    fields = {}
    bb.on 'field', (name, val) =>
      if not name in names or fields[name]? or typeof val isnt 'string'
        bb.removeAllListeners()
        cb new Error 'issue with field: ' + name
      else
        fields[name] = val
    bb.on 'finish', =>
      for key in names
        if not fields[key]?
          return cb new Error 'missing field: ' + key
      cb null, fields
    req.pipe bb
  
  error: (res, msg) ->
    res.redirect './?error=' + encodeURIComponent msg


module.exports = Page
