const mysql = require('mysql2/promise');

var pool = mysql.createPool({
    host: "us-cdbr-east-04.cleardb.com",
    user: "b279a5641ab7e3", 
    password: "2c01f496",
    database: "heroku_828ebb76607f724"
});

//const pool = mysql.createPool({
//    host: 'localhost',
//    user: 'root',
//    password: 'Lightbell03!',
//    database: 'db_test'
//});

module.exports = pool;