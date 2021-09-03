var express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
var router = express.Router();
var mysql = require("mysql");

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Lightbell03!",
    database: "db_test"
});

//router.use(
//  createProxyMiddleware("/users", {
//    target: "https://192.168.45.52:3000",
//    changeOrigin: true,
//  })
//);

router.post('/', function(res, res) {
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
          //res.send({"success": 'success', "message": "User not found, please try again"});
          res.send({status: 'fail'});
        }
    });
});

module.exports = router;