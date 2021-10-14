const express = require("express");
const pool = require('./sqlpool');

var router = express.Router();

router.post('/', async function(req, res){
    //var serial_number = req.body.serial_number;
    console.log(req);
    res.send("test");
    return;

    if(!serial_number)
        res.send('serial error');
    else{
        try{
            const con = await pool.getConnection(async conn => conn);
            try{
                console.log(serial_number);
                const [userRows] = await con.query(`SELECT * FROM db_test WHERE serialnumber='${serial_number}'`);
                console.log(userRows);
                if(userRows.length > 0){
                    console.log(userRows[0]);
                    res.send('test');
                }
            }catch(err){
                console.log('query error');
            }
        }catch(err){
            console.log("db error");
        }
    }
});

module.exports = router;