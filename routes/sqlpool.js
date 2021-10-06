const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Lightbell03!',
    database: 'db_test'
});

module.exports = pool;