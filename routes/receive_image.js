var express = require('express');
var bodyParser = require("body-parser");
var fs = require("fs");
var spawn = require('child_process').spawn;
var multer = require('multer');

var router = express.Router();

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

var date = new Date;
var day = date.getDate();
var month = date.getMonth() + 1;
var year = date.getFullYear();
if(day < 10) day = '0' + day;
if(month < 10) month = '0' + month;

router.post('/', function(req, res, next) {
	let dataString = "";
	let data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

	const python = spawn('python', ['./routes/index.py']);

	python.stdout.on('data', function(data) {
		dataString = data.toString();
		res.send({status: 'success', food: dataString});
	});

	python.stdin.write(JSON.stringify(data));
	python.stdin.end();
	//res.send({status: 'success', food: "감자\r\n고구마맛탕\r\n햄버거\r\n"});
});

module.exports = router;