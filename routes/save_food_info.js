var express = require("express");

var router = express.Router();

router.post('/', function(req, res){
    const user = req.body.userEmail;

    con.query(`SELECT * FROM ${user}_nutrian_db`, function(err, row){
        if(err){
            console.log(err);
            res.send({status: "fail"});
        }
        res.send({status: "success", data: row});
    })
})