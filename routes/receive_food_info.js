const request = require("request");
const cheerio = require("cheerio");
const express = require("express");
const pool = require('./sqlpool');
const router = express.Router();

const NutrianItem = ["food_Weight", "energy_Qy", "water_Qy", "prot_Qy", "ntrfs_Qy", "ashs_Qy",
                     "carbohydrate_Qy", "sugar_Qy", "fibtg_Qy", "aat19_Qy", "aae10a_Qy", "aane_Qy",
                     "fafref_Qy", "faessf_Qy", "fasatf_Qy", "famsf_Qy", "fapuf_Qy", "clci_Qy",
                     "irn_Qy", "mg_Qy", "phph_Qy", "ptss_Qy", "na_Qy", "zn_Qy", "cu_Qy",
                     "mn_Qy", "se_Qy", "mo_Qy", "id_Qy", "rtnl_Qy", "catn_Qy", "vitd_Qy", "vite_Qy",
                     "vitk1_Qy", "vtmn_B1_Qy", "vtmn_B2_Qy", "nacn_Qy", "pantac_Qy", "pyrxn_Qy",
                     "biot_Qy", "fol_Qy", "vitb12_Qy", "vtmn_C_Qy", "chole_Qy", "nacl_Qy", "ref_Qy"];

const NutrianToShow = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
                        0, 0, 0, 0, 0, 0];

/*
식품 중량(g)                food_Weight
에너지(kcal)                energy_Qy
수분(%)                     water_Qy
단백질(g)                   prot_Qy	
지질(g)	                    ntrfs_Qy	
회분(g)	                    ashs_Qy	
탄수화물(g)	                carbohydrate_Qy	
총 당류(g)	                sugar_Qy	
총 식이섬유(g)	            fibtg_Qy   
총 아미노산(mg)	            aat19_Qy
필수 아미노산(mg)	        aae10a_Qy
비필수 아미노산(mg)	        aane_Qy
총 지방산(g)	            fafref_Qy
총 필수 지방산(g)	        faessf_Qy
총 포화 지방산(g)	        fasatf_Qy
총 단일 불포화 지방산(g)	 famsf_Qy
총 다중 불포화 지방산(g)	 fapuf_Qy
칼슘(mg)	                clci_Qy
철(mg)	                    irn_Qy
마그네슘(mg)	            mg_Qy
인(mg)	                    phph_Qy
칼륨(mg)	                ptss_Qy
나트륨	(mg)                na_Qy
아연(mg)	                zn_Qy
구리(mg)	                cu_Qy
망간(mg)	                mn_Qy
셀레늄(μg)	                se_Qy
몰리브덴(μg)	            mo_Qy
요오드(μg)	                id_Qy
레티놀(μg)	                rtnl_Qy
베타카로틴(μg)	            catn_Qy
비타민D(D2+D3)(μg)	        vitd_Qy
비타민E(μg)	                vite_Qy
비타민K1(μg)	            vitk1_Qy
비타민B1(mg)	            vtmn_B1_Qy
비타민B2(mg)	            vtmn_B2_Qy
니아신(mg)	                nacn_Qy
판토텐산(비타민B5)(mg)	    pantac_Qy
비타민B6(mg)	            pyrxn_Qy
비오틴(mg)	                biot_Qy
엽산(μg)	                fol_Qy
비타민B12(μg)	            vitb12_Qy
비타민C(mg)	                vtmn_C_Qy
콜레스테롤(mg)	            chole_Qy
식염상당량(g)	            nacl_Qy
폐기물(g)	                ref_Qy
*/

function GetFoodCode(foodName){
    return new Promise(function(resolve, reject){
        var foodCode = [];
        var url = 'http://apis.data.go.kr/1390802/AgriFood/MzenFoodCode/getKoreanFoodList';
        var queryParams = '?' + encodeURIComponent('ServiceKey') + '=hR0Dnog8Mq853S2bzK9mVuczmOgu%2FtCZKyfed3h3hP%2Bk2%2BD8IGBkovkq93lJrn94tQeX6WpmdLeSqd0d2q172g%3D%3D'; /* Service Key*/
        queryParams += '&' + encodeURIComponent('food_Name') + '=' + encodeURIComponent(foodName);
            
        request({
            url: url + queryParams,
            method: 'GET'
        }, function (error, response, body) {
            if(body){
                let $ = cheerio.load(body);
                $("item").each(function(idx){
                    foodCode.push($(this).find("food_Code").text());
                    return;
                });
                resolve(foodCode);
            }
            else reject(new Error("Request is failed"));
        });
    
    });
}

function CalFoodNutri(foodCode){
    return new Promise(function(resolve, reject){
        var url = 'http://apis.data.go.kr/1390802/AgriFood/MzenFoodNutri/getKoreanFoodIdntList';
        var queryParams = '?' + encodeURIComponent('ServiceKey') + '=hR0Dnog8Mq853S2bzK9mVuczmOgu%2FtCZKyfed3h3hP%2Bk2%2BD8IGBkovkq93lJrn94tQeX6WpmdLeSqd0d2q172g%3D%3D'; /* Service Key*/
        queryParams += '&' + encodeURIComponent('food_Code') + '=' + encodeURIComponent(foodCode);
        request({
            url: url + queryParams,
            method: 'GET'
        }, function (error, response, body) {
            if(body){
                var $ = cheerio.load(body);
                $('idnt_List').each(function(listIdx){
                    for(let j = 0; j<NutrianItem.length; j++){
                        let nutriansize = $(this).find(NutrianItem[j]).text();
                        nutriansize = Number(nutriansize);
                        NutrianToShow[j] += nutriansize;
                    }
                });
                resolve(NutrianToShow);
            }
            else reject(new Error("Request is fail"));
        });
    })
}

async function SendData(division, user, today){
    try{
        const con = await pool.getConnection(async conn => conn);

        try{
            const [divisionRows] = await con.query(`SELECT * FROM ${user}_food_db WHERE division = '${division}' AND date = '${today}'`);
            const [divisionNutriRows] = await con.query(`SELECT * FROM ${user}_nutrian_db WHERE division = '${division}' AND date = '${today}'`);
            const [totalNutriRows] = await con.query(`SELECT * FROM ${user}_nutrian_db WHERE division = 'total' AND date = '${today}'`);

            let sendData = [];
            for(let key in totalNutriRows[0]){
                if(key === 'division' || key === 'date')
                    continue;
                sendData.push(totalNutriRows[0][key]);
            }
            return {divisionFood: divisionRows[0], divisionNutri: divisionNutriRows[0], totalNutri: sendData}
        }catch(err){
            console.log(err);
            return null;
        }
    }catch(err){
        console.log(err);
        return null;
    }
}

const date = new Date();
var day = date.getDate();
var month = date.getMonth() + 1;
var year = date.getFullYear();

if(day < 10) day = '0' + day;
if(month < 9) month = '0' + month;

const today = (year + '-' + month + '-' + day);

router.post('/', async (req, res) => {
    const division = req.body.division;
    const food = req.body.food;
    const user = req.body.user;
    const sqlInput = [division, today];

    for(let i = 0; i < food.length; i++){
        sqlInput.push(food[i]);
    }
    for(let i = food.length; i<5; i++){
        sqlInput.push("");
    }

    try{
        const con = await pool.getConnection(async conn => conn);
        
        try{
            const [foodRows] = await con.query(`SELECT * FROM ${user}_food_db WHERE (division, date) = ('${division}', ${today})`);
            
            await con.query(`INSERT INTO ${user}_food_db (division, date, food1, food2, food3, food4, food5) VALUES (?, ?, ?, ?, ?, ?, ?)`, sqlInput);

            for(let i=0; i<food.length; i++){                
                const foodCode = await GetFoodCode(food[i]);
                await CalFoodNutri(foodCode);
            }
    
            await con.query(`INSERT INTO ${user}_nutrian_db (division, date, ${NutrianItem}) VALUES ('${division}', '${today}', ${NutrianToShow})`);
            
            const [nutrianRows] = await con.query(`SELECT * FROM ${user}_nutrian_db WHERE division = 'total' AND date = '${today}'`);
            
            if(nutrianRows.length === 0){
                await con.query(`INSERT INTO ${user}_nutrian_db (division, date, ${NutrianItem}) VALUES ('total', '${today}', ${NutrianToShow})`);
            }
            else{
                for(let i=0; i<NutrianItem.length; i++){
                    await con.query(`UPDATE ${user}_nutrian_db SET ${NutrianItem[i]} = (SELECT * FROM (SELECT sum(${NutrianItem[i]}) FROM test_nutrian_db WHERE date = '${today}' AND division != 'total') as a) WHERE division = 'total' and date = '${today}'`)
                }
            }


            switch(division){
                case 'breakfast':
                {
                    let foodData = await SendData(division, user, today);
                    if(foodData == null)
                        throw foodData;
                    res.send({status: 'success', foodList: foodData.divisionFood, nutriList: foodData.divisionNutri, totalNutriList: foodData.totalNutri});
                    break;
                }
                case 'lunch':
                {
                    let foodData = await SendData(division, user, today);
                    if(foodData == null)
                        throw foodData;
                    res.send({status: 'success', foodList: foodData.divisionFood, nutriList: foodData.divisionNutri, totalNutriList: foodData.totalNutri});
                    break;
                }
                case 'dinner':
                {
                    let foodData = await SendData(division, user, today);
                    if(foodData == null)
                        throw foodData;
                    res.send({status: 'success', foodList: foodData.divisionFood, nutriList: foodData.divisionNutri, totalNutriList: foodData.totalNutri});
                    break;
                }
                case 'etc':
                {
                    let foodData = await SendData(division, user, today);
                    if(foodData == null)
                        throw foodData;
                    res.send({status: 'success', foodList: foodData.divisionFood, nutriList: foodData.divisionNutri, totalNutriList: foodData.totalNutri});
                    break;
                }
            }
            NutrianToShow.fill(0,0,45);
        }catch(err){
            console.log("query error");
            console.log(err);
            res.send({state: 'fail1'});
        }
    }catch(err){
        console.log("db error");
        console.log(err);
        res.send({status: con});
    }
});

module.exports = router;