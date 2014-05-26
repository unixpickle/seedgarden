Page = require './page'

class Logout extends Page
  constructor: -> super()
  
  path: -> '/logout'
  
  get: (req, res) ->
    delete req.session.userInfo
    res.redirect 'login'

module.exports = Logout
