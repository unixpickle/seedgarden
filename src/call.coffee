xmlrpc = require 'xmlrpc'

class Call
  constructor: (@method, @arguments) ->

module.exports = Call
