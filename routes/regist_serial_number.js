const express = require('express');
const con = require('./sqlcon');

var route = express.Router();

route.post('/', async function(req, res){
    var user = req.body.userEmail;
    var user_serial_number = req.body.serial_number;

    console.log(user);
    con.query(`SELECT * FROM serial_number_db_tb WHERE serial_number = ${user_serial_number}`, (err, row) => {
        if(err){
            console.log(err);
            res.send({status: "new serial number error"});
            return;
        }
        if(row.length > 0){
            if(!row[0].used){
                con.query(`UPDATE serial_number_db_tb SET used = ${true} WHERE serial_number=${user_serial_number}`, (err) => {
                    if(err){
                        console.log("serial_number_db_tb UPDATE error");
                        console.log(err);
                        res.send({status: "serial_number_db_tb UPDATE error"});
                        return;
                    }
                    con.query(`SELECT * FROM db_test WHERE email = '${user}'`, (err, row) => {
                        if(err){
                            console.log("hjefdjas");
                            console.log(err);
                            res.send({status: 'error'});
                            return;
                        }
                        if(row.length > 0){
                            con.query(`UPDATE db_test SET serialnumber=${user_serial_number} WHERE email = '${user}'`, function(err){
                                if(err){
                                    console.log("user serial number update error");
                                    console.log(err);
                                    res.send({status: "user serail number update error"});
                                    return;
                                }
                                console.log("success");
                                res.send({status: "success"});
                            });
                        }
                        else{
                            console.log("email error");
                            res.send({status: 'email error'});
                            return;
                        }
                    });
                })
            }
            else{
                console.log("serial key use");
                res.send("serial key is duplicate");
            }
        }
        else{
            console.log("no serial number");
            res.send({status: "no serial number"});
            return;
        }
    })
})

module.exports = route;