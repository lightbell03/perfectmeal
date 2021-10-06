var express = require("express");
var bcrypt = require("bcrypt");
var request = require("request");
var router = express.Router();
var con = require("./sqlcon");

router.post('/', function(req, res) {
    var userEmail = req.body.email;
    var password = req.body.password;

    con.query("SELECT * FROM db_test WHERE email = (?)", [userEmail], function(err, row) {
        if(err) {
          res.send({status: 'error'});
          console.log(err);
        }

        if(row.length > 0){
          bcrypt.compare(password, row[0].password, function(err, result){
            if(result){
              if(row[0].serialnumber === '0'){
                console.log("no serial number");
                res.send({status: 'no'});
                return;
              }
              con.query(`SELECT * FROM ${userEmail}_nutrian_db`, function(err, row){
                if(err){
                    console.log(err);
                    res.send({status: "nutiran 정보 가져오기 실패"});
                }
                res.send({status: "success", email: userEmail, data: row});
              });
            }
            else{
              console.log(password);
              console.log(row[0].password);
              res.send({status: 'password가 다릅니다.'});
            }
          });
        }
        else{
          res.send({status: "아이디가 존재하지 않습니다."});
        }
    });
});

module.exports = router;