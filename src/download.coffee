class Download
  constructor: (list) ->
    [@hash, @directory, @basePath, @completedBytes,
      @sizeBytes, @name, @upRate, @downRate, @upTotal,
      @downTotal, @state] = list
    

module.exports = Download
