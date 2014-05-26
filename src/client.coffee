xmlrpc = require 'xmlrpc'
url = require 'url'

Download = require './download'
Call = require './call'

class Client
  constructor: (rpcURL, username, password) ->
    parsed = url.parse rpcURL
    @client = xmlrpc.createClient
      url: rpcURL
      basic_auth:
        user: username
        pass: password
  
  call: (aCall, cb) ->
    @client.methodCall aCall.method, aCall.arguments, cb
  
  getDownloads: (cb) ->
    args = ['main', 'd.get_hash=', 'd.get_directory=', 'd.get_base_path=',
      'd.get_completed_bytes=', 'd.get_size_bytes=', 'd.get_name=',
      'd.get_up_rate=', 'd.get_down_rate=', 'd.get_up_total=',
      'd.get_down_total=', 'd.get_state=']
    call = new Call 'd.multicall', args
    @call call, (err, val) ->
      return cb err if err?
      cb null, (new Download x for x in val)
  
  doAction: (action, hash, cb) ->
    call = new Call action, [hash]
    @call call, cb
  
  stop: (hash, cb) -> @doAction 'd.stop', hash
  start: (hash, cb) -> @doAction 'd.start', hash
  erase: (hash, cb) -> @doAction 'd.erase', hash
  close: (hash, cb) -> @doAction 'd.close', hash

module.exports = Client
