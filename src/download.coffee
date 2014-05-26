class Download
  constructor: (list) ->
    [@hash, @directory, @basePath, @completedBytes,
      @sizeBytes, @name, @upRate, @downRate, @upTotal,
      @downTotal, @state] = list
  
  toClientJSON: ->
    ratio = @upTotal / @downTotal
    ratio = 0 if not ratio
    return {
      name: @name
      percentage: Math.floor 100 * @completedBytes / @sizeBytes
      ratio: ratio.toFixed 3
      isActive: @state isnt '0'
      hash: @hash
    }
    

module.exports = Download
