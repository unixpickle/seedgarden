Page = require './page'

class Login extends Page
  constructor: -> super()
  
  path: -> '/login'
  
  get: (req, res) ->
    @template res, 'login.mustache', {}
  
  post: (req, res) ->
    @postArgs req, ['username', 'rpcurl', 'password'], (err, fields) ->
      return res.send 400, 'invalid request' if err?
      req.session.userInfo = fields
      res.redirect './'

module.exports = Login
