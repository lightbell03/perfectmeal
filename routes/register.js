var express = require("express");
var bcrypt = require("bcrypt");

var router = express.Router();
var con = require("./sqlcon");

router.post('/', function(req, res) {
    var userEmail = req.body.email;
    var password = req.body.password;
    var userName = req.body.name;
    var userAge = req. body.age;
    var userAddress = req.body.address;
    var cryptPw = "";

    con.query("SELECT * FROM db_test WHERE email = (?)", [userEmail], function(err, row){
        if(err) {
            res.send({stauts: "회원가입 오류1"});
            console.log(err);
        }
        
        if(row.length == 0){
            cryptPw = bcrypt.hashSync(password, 10);
            con.query("INSERT INTO db_test (name, password, email, age, address, serialnumber) VALUES (?, ?, ?, ?, ?, ?)",
                [userName, cryptPw, userEmail, userAge, userAddress, "0"], function(err) {
                if(err) {
                    console.log(err);
                    res.send({status: '회원가입 오류2'});
                }
                else {
                    con.query("CREATE TABLE " + userEmail + "_food_db (division VARCHAR(10) NOT NULL, date DATE NOT NULL,\
                                    food1 VARCHAR(45) NULL, food2 VARCHAR(45) NULL, food3 VARCHAR(45) NULL, food4 VARCHAR(45) NULL,\
                                    food5 VARCHAR(45) NULL)", function(err){
                        if(err) {
                            console.log(err);
                            res.send({status: '회원가입 오류3'});
                        }
                    });
                    
                    const NutrianItem = ["food_Weight", "energy_Qy", "water_Qy", "prot_Qy", "ntrfs_Qy", "ashs_Qy",
                     "carbohydrate_Qy", "sugar_Qy", "fibtg_Qy", "aat19_Qy", "aae10a_Qy", "aane_Qy",
                     "fafref_Qy", "faessf_Qy", "fasatf_Qy", "famsf_Qy", "fapuf_Qy", "clci_Qy",
                     "irn_Qy", "mg_Qy", "phph_Qy", "ptss_Qy", "na_Qy", "zn_Qy", "cu_Qy",
                     "mn_Qy", "se_Qy", "mo_Qy", "id_Qy", "rtnl_Qy", "catn_Qy", "vitd_Qy",
                     "vitk1_Qy", "vtmn_B1_Qy", "vtmn_B2_Qy", "nacn_Qy", "pantac_Qy", "pyrxn_Qy",
                     "biot_Qy", "fol_Qy", "vitb12_Qy", "vtmn_C_Qy", "chole_Qy", "nacl_Qy", "ref_Qy"];


                    con.query("CREATE TABLE " + userEmail + "_nutrian_db (division VARCHAR(10) NOT NULL, date DATE NOT NULL, \
                    food_Weight FLOAT NOT NULL, energy_Qy FLOAT NOT NULL, water_Qy FLOAT NOT NULL, prot_Qy\
                    FLOAT NOT NULL, ntrfs_Qy FLOAT NOT NULL, ashs_Qy FLOAT NOT NULL, \
                    carbohydrate_Qy FLOAT NOT NULL, sugar_Qy FLOAT NOT NULL, fibtg_Qy FLOAT NOT NULL, \
                    aat19_Qy FLOAT NOT NULL, aae10a_Qy FLOAT NOT NULL, aane_Qy FLOAT NOT NULL, \
                    fafref_Qy FLOAT NOT NULL, faessf_Qy FLOAT NOT NULL, fasatf_Qy FLOAT NOT NULL, \
                    famsf_Qy FLOAT NOT NULL, fapuf_Qy FLOAT NOT NULL, clci_Qy FLOAT NOT NULL, \
                    irn_Qy FLOAT NOT NULL, mg_Qy FLOAT NOT NULL, phph_Qy FLOAT NOT NULL, ptss_Qy FLOAT NOT NULL, \
                    na_Qy FLOAT NOT NULL, zn_Qy FLOAT NOT NULL, cu_Qy FLOAT NOT NULL, \
                    mn_Qy FLOAT NOT NULL, se_Qy FLOAT NOT NULL, mo_Qy FLOAT NOT NULL, id_Qy FLOAT NOT NULL, \
                    rtnl_Qy FLOAT NOT NULL, catn_Qy FLOAT NOT NULL, vitd_Qy FLOAT NOT NULL, vite_Qy FLOAT NOT NULL, \
                    vitk1_Qy FLOAT NOT NULL, vtmn_B1_Qy FLOAT NOT NULL, vtmn_B2_Qy FLOAT NOT NULL, \
                    nacn_Qy FLOAT NOT NULL, pantac_Qy FLOAT NOT NULL, pyrxn_Qy FLOAT NOT NULL, \
                    biot_Qy FLOAT NOT NULL, fol_Qy FLOAT NOT NULL, vitb12_Qy FLOAT NOT NULL, vtmn_C_Qy FLOAT NOT NULL, \
                    chole_Qy FLOAT NOT NULL, nacl_Qy FLOAT NOT NULL, ref_Qy FLOAT NOT NULL)", function(err){
                        if(err) {
                            console.log(err);
                            res.send({status: 'Nutrian_db create erro'});
                        }
                    });
                    console.log("register success");
                    res.send({status: 'success'});                
                }
            });
        }
        else{
            console.log(err);
            res.send({status: '중복되는 이메일이 존재합니다.'});
        }
    });
});

module.exports = router;