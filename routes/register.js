var express = require("express");
var router = express.Router();
var mysql = require("mysql");
var proxyMiddleware = require("http-proxy-middleware");

var con = mysql.createConnection({
    host: "us-cdbr-east-04.cleardb.com",
    user: "b279a5641ab7e3",
    password: "2c01f496",
    database: "heroku_828ebb76607f724"
});

router.post('/', function(req, res) {
    var userEmail = req.body.email;
    var password = req.body.password;
    var userName = req.body.name;
    var userAge = req. body.age;
    var userAddress = req.body.address;

    con.query("SELECT * FROM db_test WHERE email = (?)", [userEmail], function(err, row){
        if(err) {
            console.log("register error");
            console.log(err); v5
        }
        
        if(row.length == 0){
            con.query("INSERT INTO db_test (name, password, email, age, address) VALUES (?, ?, ?, ?, ?)",
                [userName, password, userEmail, userAge, userAddress], function(regi_err) {
                if(regi_err) {
                    console.log("test1");
                    res.send({status: 'fail1'});
                }
                else {
                    con.query("CREATE TABLE " + userEmail + "_food_db (date DATE NOT NULL,  food1 VARCHAR(45) NULL, food2 VARCHAR(45) NULL, food3 VARCHAR(45) NULL, food4 VARCHAR(45) NULL,food5 VARCHAR(45) NULL, PRIMARY KEY (date))", function(err){
                        if(err) {
                            console.log(err);
                            res.send({status: 'fail2'});
                        }
                        else{
                            console.log("register success");
                            res.send({status: 'success'});
                        }
                    });
                }
            });
        }
        else{
            console.log(regi_err);
            res.send({status: 'email duplicate'});
        }
    });
});
router.post("/", function(req, res){
    res.send({status: "success"});
})

module.exports = router;