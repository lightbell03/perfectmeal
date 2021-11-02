const express = require("express");
const pool = require("./sqlpool");

var router = express.Router();

const ManAverNutri = [2301.5, 84.4, 56.8, 18.9, 298.1, 324.9, 24.0, 64.5, 571.6, 13.5, 3809.5, 2862.7, 13.0, 408.3,
    1562.6, 1856.4, 15.2, 65.3];

const WomanAverNutri = [1661.1, 59.8, 41.9, 14.2, 221.1, 249.3, 19.7, 55.6, 459.2, 895.6, 2679.6, 2272.4, 9.7, 340.2,
    1093.4, 1413.6, 11.1, 55.6];

const IndexUnderNutri = [0, 2, 3, 13, 42, 5, 7, 6, 16, 19, 21, 16, 17, 28, 33, 34, 35, 41];
const foodIndex = ['food1', 'food2', 'food3', 'food4', 'food5'];

router.post('/', async (req, res) => {
    var isToday = req.body.isToday;
    var today = req.body.today;
    var user = req.body.userEmail;

    try {
        const con = await pool.getConnection(async conn => conn);
    
        try{

            if(isToday){
                [todayTotalNutriRows] = await con.query(`SELECT * FROM ${user}_nutrian_db WHERE date = '${today}' and division = 'total'`);
                if(todayTotalNutriRows.length === 0){
                    res.send({status: "success", totalNutri: [], breakfast: undefined, lunch: undefined, dinner: undefined, etc: undefined,
                            breakfastNutri: undefined, lunchNutri: undefined, dinnerNutri: undefined, etcNutri: undefined});
                    return;
                }
                const [todayBfNutriRows] = await con.query(`SELECT * FROM ${user}_nutrian_db WHERE date = '${today}' and division = 'breakfast'`);
                const [todayLnNutriRows] = await con.query(`SELECT * FROM ${user}_nutrian_db WHERE date = '${today}' and division = 'lunch'`);
                const [todayDnNutriRows] = await con.query(`SELECT * FROM ${user}_nutrian_db WHERE date = '${today}' and division = 'dinner'`);
                const [todayEtNutriRows] = await con.query(`SELECT * FROM ${user}_nutrian_db WHERE date = '${today}' and division = 'etc'`);
                const [todayBfFoodRows] = await con.query(`SELECT ${foodIndex} FROM ${user}_food_db WHERE date = '${today}' and division = 'breakfast'`);
                const [todayLnFoodRows] = await con.query(`SELECT ${foodIndex} FROM ${user}_food_db WHERE date = '${today}' and division = 'lunch'`);
                const [todayDnFoodRows] = await con.query(`SELECT ${foodIndex} FROM ${user}_food_db WHERE date = '${today}' and division = 'dinner'`);
                const [todayEtFoodRows] = await con.query(`SELECT ${foodIndex} FROM ${user}_food_db WHERE date = '${today}' and division = 'etc'`);
                const [userGender] = await con.query(`SELECT gender FROM db_test WHERE email='${user}'`);

                let sendData = [];
                for(let key in todayTotalNutriRows[0]){
                    if(key === 'division' || key === 'date')
                        continue;
                    sendData.push(todayTotalNutriRows[0][key]);
                }
                //부족 영양소 계산
                let underNutriData = [];
                if(userGender[0].gender === 'man'){
                    for(let i=0; i<IndexUnderNutri.length; i++){
                        let tmp = sendData[IndexUnderNutri[i]] - ManAverNutri[i];
                        tmp = Number(tmp.toFixed(3));
                        underNutriData.push(tmp);
                    }
                }
                else if(userGender[0].gender === 'woman'){
                    for(let i=0; i<IndexUnderNutri.length; i++){
                        let tmp = sendData[IndexUnderNutri[i]] - WomanAverNutri[i];
                        tmp = Number(tmp.toFixed(3));
                        underNutriData.push(tmp);
                    }
                }
                
                var breakfast = Object.values(JSON.parse(JSON.stringify(todayBfFoodRows)));
                var lunch = Object.values(JSON.parse(JSON.stringify(todayLnFoodRows)));
                var dinner = Object.values(JSON.parse(JSON.stringify(todayDnFoodRows)));
                var breakfastNutri = Object.values(JSON.parse(JSON.stringify(todayBfNutriRows)));
                var lunchNutri = Object.values(JSON.parse(JSON.stringify(todayLnNutriRows)));
                var dinnerNutri = Object.values(JSON.parse(JSON.stringify(todayDnNutriRows)));
                
                res.send({status: "success", totalNutri: sendData, breakfast: breakfast[0], lunch: lunch[0], dinner: dinner[0], etc: todayEtFoodRows[0],
                            breakfastNutri: breakfastNutri[0], lunchNutri: lunchNutri[0], dinnerNutri: dinnerNutri[0], etcNutri: todayEtNutriRows[0], underNutri: underNutriData});
                
                sendData = null;
            }
            else{
                const [foodRows] = await con.query(`SELECT * FROM ${user}_food_db WHERE date='${today}'`);
                const [breakfastFoodRow] = await con.query(`SELECT * FROM ${user}_food_db WHERE division = 'breakfast' AND date = '${today}'`);
                const [lunchFoodRow] = await con.query(`SELECT * FROM ${user}_food_db WHERE division = 'lunch' AND date = '${today}'`);
                const [dinnerFoodRow] = await con.query(`SELECT * FROM ${user}_food_db WHERE division = 'dinner' AND date = '${today}'`);
                
                var breakfast = Object.values(JSON.parse(JSON.stringify(breakfastFoodRow)));
                var lunch = Object.values(JSON.parse(JSON.stringify(lunchFoodRow)));
                var dinner = Object.values(JSON.parse(JSON.stringify(dinnerFoodRow)))

                if(foodRows.length === 0){
                    res.send({status: 'no food'});
                    return;
                } else {
                    res.send({status: 'success', breakfast: breakfast[0], lunch: lunch[0], dinner: dinner[0]});
                }
            }
        } catch(err){
            console.log('DB error');
            console.log(err);
            res.send({status: 'DB error'});
            return false;
        }
    } catch(err) {
        console.log("db error");
        res.send({status: "tets"});
        return false;
    }
});

module.exports = router;

//(DATE_SUB('${today}', INTERVAL 14 DAY))