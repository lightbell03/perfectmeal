var express = require('express');
var bodyParser = require("body-parser");
var fs = require("fs");
var spawn = require('child_process').spawn;

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

router.post('/', function(req, res, next) {
	let dataString = "";
	let data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
	var imageBase64 = req.body.imgsource;

	const python = spawn('python', ['./yolov5/index.py']);

	python.stdin.write(imageBase64);//JSON.stringify(imageBase64));//(JSON.stringify(data));
	
	python.stdout.on('data', function(data) {
		dataString = data.toString();

	});

	python.on('close', (code)=>{
		res.send({status: 'success', food: dataString});
	})

	python.stdin.end();
	
});

/*
const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');

var router = express.Router();

router.use(bodyParser.json());

const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, '/');
  },
  filename(req, file, callback) {
    callback(null, `test.jpg`);
  },
});

const upload = multer({ storage: storage });

router.post('/', upload.array('photo', 2), (req , res) => {
  var image = req.files;
  console.log(req.files);
  //console.log('body', req.body);
  res.send({
    status: 'success',
  });
});
*/
module.exports = router;