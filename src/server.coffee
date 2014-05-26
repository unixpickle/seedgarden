express = require 'express'
cookieParser = require 'cookie-parser'
session = require 'express-session'

pageRoot = '/seedgarden'

if process.argv.length isnt 3
  console.log 'Usage: coffee src/server.coffee <port>'
  process.exit()

port = parseInt process.argv[2]
if not port
  console.log 'invalid port: ' + port
  process.exit()

pages = ['home', 'login', 'logout', 'startstop', 'add', 'delete']

app = express()
app.use pageRoot + '/assets', express.static __dirname + '/../assets'
app.use cookieParser()
app.use session 
  secret: '32132132' + Math.random()
  cookie:
    maxAge: 60000 * 60 * 24 * 30 # about one month

for page in pages
  p = new (require './pages/' + page)()
  app.get pageRoot + p.path(), p.get.bind p
  app.post pageRoot + p.path(), p.post.bind p

if pageRoot.length
  app.get pageRoot, (req, res) -> res.redirect pageRoot + '/'

app.listen port

