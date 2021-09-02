var express = require("express");
var router = express.Router();
var mysql = require("mysql");

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Lightbell03!",
    database: "db_test"
});

router.post('/', function(req, res, next) {
    var userEmail = req.body.email;
    var password = req.body.password;

    con.query("SELECT * FROM db_test WHERE email = ? AND password = ?", [userEmail, password], function(err, row) {
        if(err) console.log(err);

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