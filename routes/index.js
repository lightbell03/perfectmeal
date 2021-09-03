var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var userEmail = req.body.email;
  var password = req.body.password;
  res.write("<h>test</h>")
  res.render('index', { title: 'Express' });
});

module.exports = router;