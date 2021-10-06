const express = require("express");
const mysql = require('mysql2/promise');
const pool = require("./sqlpool");

var router = express.Router();

router.post('/', async (req, res) => {
    var isToday = req.body.isToday;
    var today = req.body.today;
    var user = req.body.userEmail;

    try {
        const con = await pool.getConnection(async conn => conn);
    
        try{
            await con.beginTransaction();

            if(isToday){
                const [todayTotalNutriRows] = await con.query(`SELECT * FROM ${user}_nutrian_db WHERE date = '${today}' and division = 'total'`);
                const [todayBfNutriRows] = await con.query(`SELECT * FROM ${user}_nutrian_db WHERE date = '${today}' and division = 'breakfast'`);
                const [todayLnNutriRows] = await con.query(`SELECT * FROM ${user}_nutrian_db WHERE date = '${today}' and division = 'lunch'`);
                const [todayDnNutriRows] = await con.query(`SELECT * FROM ${user}_nutrian_db WHERE date = '${today}' and division = 'dinner'`);
                const [todayEtNutriRows] = await con.query(`SELECT * FROM ${user}_nutrian_db WHERE date = '${today}' and division = 'etc'`);
                const [todayBfFoodRows] = await con.query(`SELECT * FROM ${user}_food_db WHERE date = '${today}' and division = 'breakfast'`);
                const [todayLnFoodRows] = await con.query(`SELECT * FROM ${user}_food_db WHERE date = '${today}' and division = 'lunch'`);
                const [todayDnFoodRows] = await con.query(`SELECT * FROM ${user}_food_db WHERE date = '${today}' and division = 'dinner'`);
                const [todayEtFoodRows] = await con.query(`SELECT * FROM ${user}_food_db WHERE date = '${today}' and division = 'etc'`);

                let sendData = [];
                for(let key in todayTotalNutriRows[0]){
                    if(key === 'division' || key === 'date')
                        continue;
                    sendData.push(todayTotalNutriRows[0][key]);
                }

                res.send({status: "success", totalNutri: sendData, breakfast: todayBfFoodRows[0], lunch: todayLnFoodRows[0], dinner: todayDnFoodRows[0], etc: todayEtFoodRows[0],
                            breakfastNutri: todayBfNutriRows[0], lunchNutri: todayLnNutriRows[0], dinnerNutri: todayDnNutriRows[0], etcNutri: todayEtNutriRows[0]});
                
                sendData = null;
            }
            else{
                
            }
        } catch(err){
            console.log('DB error');
            console.log(err);
            res.send({status: 'DB error'});
            return false;
        }
    } catch(err) {
        console.log("db error");
        res.send({status: err});
        return false;
    }
});

module.exports = router;

//(DATE_SUB('${today}', INTERVAL 14 DAY))