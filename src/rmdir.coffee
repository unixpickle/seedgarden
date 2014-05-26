joinPaths = (first, second) ->
  if first[first.length - 1] is '/'
    return first + second
  else
    return first + '/' + second

rmdir = (path, _compress, _cb) ->
  cb = if _cb? then _cb else _compress
  compress = if _cb? then [_compress] else []
  @list path, compress..., (err, list) =>
    return cb err if err?
    idx = 0
    func = (err) =>
      return cb err if err?
      if idx >= list.length
        return cb null if list[0]?.name is path
        return @_send 'RMD ' + path, cb
      [oldIdx, idx] = [idx, idx + 1]
      entry = list[oldIdx]
      if entry.name[0] is '/'
        subpath = entry.name
      else
        subpath = joinPaths path, entry.name
      if entry.type is 'd'
        @rmdir subpath, compress..., func
      else
        @delete subpath, func
    func null

module.exports = rmdir
