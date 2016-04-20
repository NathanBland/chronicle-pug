var express = require('express')
var routes = require('./routes/')
var sass = require('node-sass-middleware')
var app = express()

app.set('port', 8080)
app.set('ip', '0.0.0.0')

app.set('view engine', 'jade')
app.use(
  sass({
    root: __dirname,
    indentedSyntax: true,
    src: '/sass',
    dest: '/public/css',
    prefix: '/css',
    debug: true
  })
)
app.use(express.static('public'))

app.use(routes.setup(app, express))

var server = app.listen(app.get('port'), app.get('ip'), function () {
  console.log('Chronicle UI has started...')
})
