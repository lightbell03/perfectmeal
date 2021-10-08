const express = require('express');
const pool = require('./sqlpool');

var route = express.Router();

route.post('/', async (req, res) => {
    var user = req.body.userEamil;
    var user_serial_number = req.body.serial_number;

    try{
        const con = await pool.getConnection(async conn => conn);

        try{
            
            const [serialNumRows] = await con.query(`SELECT * FROM serial_number_db_tb WHERE serial_number = '${user_serial_number}'`);

            if(serialNumRows.length > 0){
                if(!serialNumRows[0].used){
                    
                    await con.query(`UPDATE serial_number_db_tb SET used = ${true} WHERE serial_number='${user_serial_number}'`);
                    await con.query(`UPDATE db_test SET serialnumber='${user_serial_number}' WHERE email = '${user}'`);
                    res.send({status: "success"});
                } else {
                    res.send({status: 'used serial_number'});
                }

            } else{
                res.send({status: "no serial number"});
                return;
            }
        }catch(err){
            res.send({status: 'query error'});
            return;
        }
    }catch(err){
        res.send({status: 'db error'});
        return;
    }
});

module.exports = route;