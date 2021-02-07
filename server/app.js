const http = require("http");
const express = require('express');
const bodyParser = require("body-parser");
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const hostname = "127.0.0.1";
const port = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(bodyParser.json());

// var upload = multer({dest: 'temp/'});

// const admin = require('firebase-admin');
// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount)
//   });
  
// const db = admin.firestore();

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'temp/');
    },

    // By default, multer removes file extensions so let's add them back
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + 'temp' + path.extname(file.originalname));
    }
});

// Upload enpoint for all applicants data
app.post('/api/uploadApplicantsFile', function (req, res) {
    let upload = multer({ storage: storage, }).single('ApplicantsFile');

    upload(req, res, function(err){
        console.log(req.file);
        res.status(200).send({data:"hell yeah"});
    });
});

// Upload enpoint for all instructors data
app.post('/api/uploadInstructorsFile', function (req, res) {
    let upload = multer({ storage: storage, }).single('InstructorsFile');

    upload(req, res, function(err){
        console.log(req.file);
        res.status(200).send({data:"hell yeah"});
    });
});

// Get a schedule
app.get('/api/profs',  (request, response) => {

    try {
        response.status(200).send({data:"something"});
    }
    catch(err){
        response.send({
            err: err.message,
        });
    }
});

// app.post('/api/uploadApplicantsFile',  (request, response) => {

//     try {
//         console.log(request.body);
//         console.log(request.files);
//         response.send({data:"something"});
//     }
//     catch(err){
//         response.send({
//             err: err.message,
//         });
//     }
// });

app.listen(port, hostname, () => {
    console.log('Listening on: ' + port);
});


// const server = http.createServer((req, res) => {
//     res.statusCode = 200;
//     res.setHeader("Content-Type", "text/plain");
//     res.end("Hello World");
// });

// server.listen(port, hostname, () => {
//     console.log(`Server running at http://${hostname}:${port}/`);
// });
