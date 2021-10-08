var express = require("express");
var bcrypt = require("bcrypt");
var router = express.Router();
var pool = require('./sqlpool');

router.post('/', async (req, res) => {
  var userEmail = req.body.email;
  var password = req.body.password;

  try{
    const con = await pool.getConnection(async conn => conn);

    try{
      const [userRows] = await con.query(`SELECT * FROM db_test WHERE email = '${userEmail}'`);
      if(userRows.length > 0){
        bcrypt.compare(password, userRows[0].password, async (err, result) => {
          if(result){
            if(userRows[0].serialnumber === '0'){
              res.send({status: 'serialnumber'});
              return;
            } else {
              const [userNutrianRows] = await con.query(`SELECT * FROM '${userEmail}_nutrian_db'`);
              res.send({status: 'success'});
              return;
            }   
          } else {
            res.send({status: 'password가 다릅니다.'});
            return;
          }
        });
      } else {
        res.send({status: '아이디가 없습니다.'})
      }
    }catch(err){
      res.send({status: 'query error'});
    }
  }catch(err){
    res.send({status: 'db error'});
  }
})

module.exports = router;