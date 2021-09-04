const express = require('express');
const bodyParser = require("body-parser");
const fs = require("fs");
const spawn = require('child_process').spawn;
const multer = require('multer');
const mysql = require("mysql");

const router = express.Router();

const con = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "Lightbell03!",
	database: "db_test"
});

router.use(bodyParser.urlencoded({limit: '15MB', extended: true}));
router.use(bodyParser.json({limit: '15MB'}));

//const storage = multer.diskStorage({
//	destination: function(req, file, cb) {
//		if(file.mimetype == "image/jpeg" || file.mimetype == "image/jpg" || file.mimetype == "image/png") {
//			console.log("이미지 파일");
//			cb(null, '../images');
//		} else if(file.mimetype == "application/pdf" || file.mimetype == "application/txt" || file.mimetype == "application/octet-stream") {
//			console.log("텍스트 파일
//			cb(null, '../images');
//		}
//	},
//	//파일이름 설정
//	filename: function(req, file, cb) {
//		cb(null, Date.now() + " - " + file.originalname);
//	}
//});

//const upload = multer({storage: storage});

//router.post('/', function(req, res, next) {
//	let user = req.body.user;
//	let dataString = "";
//	let data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
//
//	const python = spawn('python', ['./routes/index.py']);
//
//	python.stdout.on('data', function(data) {
//	dataString = data.toString();
//	let foodArray = dataString.split("\r\n");
//	for(var i=0; i<foodArray.length - 1; i++){
//		con.query("UPDATE use_food_db SET food" + (i+1) + " = " + "'" + foodArray[i] + "'" + " WHERE email = ?", [user], function(err){
//			if(err){
//				console.log(err);
//				res.send({status: 'fail'});
//			}
//		});
//	}
//	fs.writeFile('./images/out.png', req.body.imgsource, 'base64', (image_save_err) => {
//		if (image_save_err) console.log("Test");
//	});
//	res.send({status: 'success', food: dataString});
//	});
//	python.stdin.write(JSON.stringify(data));
//	python.stdin.end();
//});
router.post("/", function(req, res) {
	res.send({status : "success"});
})

module.exports = router;