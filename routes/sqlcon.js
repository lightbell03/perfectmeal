var mysql = require("mysql");

var con = mysql.createConnection({
    host: "us-cdbr-east-04.cleardb.com",
    user: "b279a5641ab7e3", 
    password: "2c01f496",
    database: "heroku_828ebb76607f724"
});
//var con = mysql.createConnection({
//    host: "localhost",
//    user: "root",
//    password: "Lightbell03!",
//    database: "db_test",
//});

module.exports = con;