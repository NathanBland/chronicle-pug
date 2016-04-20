exports.setup = function (app, express) {
  var router = express.Router()

  router.get('/', function (req, res, next) {
    res.render('index', {
      title: 'Chroncile'
    })
  })
  return router
}
