const express = require('express');
const bodyParser = require("body-parser");
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const tempDir = 'temp/';
const hostname = "127.0.0.1";
const port = process.env.PORT || 5000;

if (!fs.existsSync(tempDir)){
    fs.mkdirSync(tempDir);
}

const app = express();
app.use(cors());
app.use(bodyParser.json());

const admin = require('firebase-admin');
const serviceAccount = require('./ta-match-gcp-service-key.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const parseSpreadsheets = require('./parse-spreadsheets.js');
const { exit } = require('process');
const parseProfData = parseSpreadsheets.parseProfData;
const parseApplicantsData = parseSpreadsheets.parseApplicantsData;
const buildProfsObj = parseSpreadsheets.buildProfsObj;

buildProfsObj('summer', 2021);


const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, tempDir);
    },

    // By default, multer removes file extensions so let's add them back
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + 'temp' + path.extname(file.originalname));
    }
});

// Upload enpoint for all applicants data
app.post('/api/uploadApplicantsFile', function (req, res) {
    let upload = multer({ storage: storage}).single('ApplicantsFile');

    upload(req, res, function(err){
        console.log(req.file);
        parseApplicantsData(req.body.semester, req.body.year);
        res.status(200).send({data:"Successful upload"});
    });
});

// Upload enpoint for all instructors data
app.post('/api/uploadInstructorsFile', function (req, res) {
    let upload = multer({ storage: storage, }).single('InstructorsFile');

    upload(req, res, function(err){
        console.log(req.file);
        parseProfData();
        res.status(200).send({data:"Successful upload"});
    });
});

app.listen(port, hostname, () => {
    console.log('Listening on: ' + port);
});