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

const ManAverNutri = [2301.5, 84.4, 56.8, 18.9, 298.1, 324.9, 24.0, 64.5, 571.6, 13.5, 3809.5, 2862.7, 13.0, 408.3,
                      1562.6, 1856.4, 15.2, 65.3];

const IndexUnderNutri = [0, 2, 3, 13, 42, 5, 7, 6, 16, 19, 21, 16, 17, 28, 33, 34, 35, 41];

const foodIndex  = ['food1', 'food2', 'food3', 'food4', 'food5'];

/*
00 식품 중량(g)                food_Weight
01 에너지(kcal)                energy_Qy
02 수분(%)                     water_Qy
03 단백질(g)                   prot_Qy	
04 지질(g)	                    ntrfs_Qy	
05 회분(g)	                    ashs_Qy	
06 탄수화물(g)	                carbohydrate_Qy	
07 총 당류(g)	                sugar_Qy	
08 총 식이섬유(g)	            fibtg_Qy   
09 총 아미노산(mg)	            aat19_Qy
10 필수 아미노산(mg)	        aae10a_Qy
11 비필수 아미노산(mg)	        aane_Qy
12 총 지방산(g)	            fafref_Qy
13 총 필수 지방산(g)	        faessf_Qy
14 총 포화 지방산(g)	        fasatf_Qy
15 총 단일 불포화 지방산(g)	 famsf_Qy
16 총 다중 불포화 지방산(g)	 fapuf_Qy
17 칼슘(mg)	                clci_Qy
18 철(mg)	                    irn_Qy
19 마그네슘(mg)	            mg_Qy
20 인(mg)	                    phph_Qy
21 칼륨(mg)	                ptss_Qy
22 나트륨	(mg)                na_Qy
23 아연(mg)	                zn_Qy
24 구리(mg)	                cu_Qy
25 망간(mg)	                mn_Qy
26 셀레늄(μg)	                se_Qy
27 몰리브덴(μg)	            mo_Qy
28 요오드(μg)	                id_Qy
29 레티놀(μg)-비타민A1	                rtnl_Qy
30 베타카로틴(μg)	            catn_Qy
31 비타민D(D2+D3)(μg)	        vitd_Qy
32 비타민E(μg)	                vite_Qy
33 비타민K1(μg)	            vitk1_Qy
34 비타민B1(mg)	            vtmn_B1_Qy
35 비타민B2(mg)	            vtmn_B2_Qy
36 니아신(mg)	                nacn_Qy
37 판토텐산(비타민B5)(mg)	    pantac_Qy
38 비타민B6(mg)	            pyrxn_Qy
39 비오틴(mg)	                biot_Qy
40 엽산(μg)	                fol_Qy
41 비타민B12(μg)	            vitb12_Qy
42 비타민C(mg)	                vtmn_C_Qy
43 콜레스테롤(mg)	            chole_Qy
44 식염상당량(g)	            nacl_Qy
45 폐기물(g)	                ref_Qy
*/
/*under nutrian list
남자
에너지
단백질
지방
포화지방산
콜레스테롤
탄수화물
식이섬유
당
칼슘
인
나트륨
칼륨
철	
비타민A
티아민 - 비타민 B1
리보플라빈 - 비타민 B2
나이아신
비타민C
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
            const [divisionRows] = await con.query(`SELECT ${foodIndex} FROM ${user}_food_db WHERE division = '${division}' AND date = '${today}'`);
            const [divisionNutriRows] = await con.query(`SELECT * FROM ${user}_nutrian_db WHERE division = '${division}' AND date = '${today}'`);
            const [totalNutriRows] = await con.query(`SELECT * FROM ${user}_nutrian_db WHERE division = 'total' AND date = '${today}'`);

            let sendData = [];
            for(let key in totalNutriRows[0]){
                if(key === 'division' || key === 'date')
                    continue;
                sendData.push(totalNutriRows[0][key]);
            }
            //부족 영양소 계산
            let underNutriData = [];
            for(let i=0; i<IndexUnderNutri.length; i++){
                let tmp = ManAverNutri[i] - sendData[IndexUnderNutri[i]];
                tmp = Number(tmp.toFixed(3));
                underNutriData.push(tmp);
            }
            
            var divisionFood = Object.values(JSON.parse(JSON.stringify(divisionRows)));
            var divisionNutri = Object.values(JSON.parse(JSON.stringify(divisionNutriRows)));
            return {divisionFood: divisionFood[0], divisionNutri: divisionNutri[0], totalNutri: sendData, underNtri: underNutriData};
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
    const edit = req.body.edit;
    const test = req.body.test;
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
            if(edit == 'new'){
                const [foodRows] = await con.query(`SELECT * FROM ${user}_food_db WHERE (division, date) = ('${division}', ${today})`);
                
                await con.query(`INSERT INTO ${user}_food_db (division, date, food1, food2, food3, food4, food5) VALUES (?, ?, ?, ?, ?, ?, ?)`, sqlInput);

                //영양소 가져오는 부분
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
                        res.send({status: 'success', foodList: foodData.divisionFood, nutriList: foodData.divisionNutri, totalNutriList: foodData.totalNutri, underNutri: foodData.underNtri});
                        break;
                    }
                    case 'lunch':
                    {
                        let foodData = await SendData(division, user, today);
                        if(foodData == null)
                            throw foodData;
                        res.send({status: 'success', foodList: foodData.divisionFood, nutriList: foodData.divisionNutri, totalNutriList: foodData.totalNutri, underNutri: foodData.underNtri});
                        break;
                    }
                    case 'dinner':
                    {
                        let foodData = await SendData(division, user, today);
                        if(foodData == null)
                            throw foodData;
                        res.send({status: 'success', foodList: foodData.divisionFood, nutriList: foodData.divisionNutri, totalNutriList: foodData.totalNutri, underNutri: foodData.underNtri});
                        break;
                    }
                    case 'etc':
                    {
                        let foodData = await SendData(division, user, today);
                        if(foodData == null)
                            throw foodData;
                        res.send({status: 'success', foodList: foodData.divisionFood, nutriList: foodData.divisionNutri, totalNutriList: foodData.totalNutri, underNutri: foodData.underNtri});
                        break;
                    }
                }
                NutrianToShow.fill(0,0,45);
            }
            else if(edit == 'add'){
                
            }
            else if(edit == 'modify') {

            }
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