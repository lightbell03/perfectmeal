var express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
var router = express.Router();
var mysql = require("mysql");

var con = mysql.createConnection({
    host: "us-cdbr-east-04.cleardb.com",
    user: "b279a5641ab7e3",
    password: "2c01f496",
    database: "heroku_828ebb76607f724"
});

router.post('/', function(req, res) {
    var userEmail = req.body.email;
    var password = req.body.password;

    con.query("SELECT * FROM db_test WHERE email = ? AND password = ?", [userEmail, password], function(err, row) {
        if(err) {
          res.write("test");
          res.send({status: 'fail'});
          console.log(err);
        }

        if(row.length > 0){
          console.log("success");
          res.send({status: 'success', email: userEmail});
        }else{
          console.log("fail");
          res.send({status: 'fail'});
        }
    });
});

module.exports = router;