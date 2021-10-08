/*const express = require("express");
const con = require("./sqlcon");
var router = express.Router();

router.post('/', function(req, res){
    if(!req.body.serial_number)
        res.send('serial error');
    con.query("SELECT * FROM db_test WHERE email = (?)", ['test'], (err, row) => {
        if(row.length>0)
            res.send(row[0].email);
    })
});

module.exports = router*/