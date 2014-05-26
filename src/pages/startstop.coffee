Page = require './page'
Client = require '../client'

class StartStop extends Page
  constructor: -> super()
  
  path: -> '/startstop'
  
  get: (req, res) ->
    if not req.session.userInfo?
      return res.redirect 'login'
    if typeof req.query.action isnt 'string'
      return res.send 400, 'invalid action field'
    if typeof req.query.hash isnt 'string'
      return res.send 400, 'invalid hash field'
    {rpcurl, username, password} = req.session.userInfo
    actions = 
      start: 'd.start'
      stop: 'd.stop'
    action = actions[req.query.action]
    return res.send 400, 'invalid action field' if not action?
    client = new Client rpcurl, username, password
    client.doAction action, req.query.hash, (err) ->
      return res.redirect './?error=failed%20to%20delete' if err?
      res.redirect './'

module.exports = StartStop
