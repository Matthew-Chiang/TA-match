const http = require("http");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(bodyParser.json());
var urlParser = bodyParser.urlencoded({ extended: false });
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
    // for all routes
    console.log(`${req.method} request for ${req.url}`);
    next();
});

app.use(express.static(path.join(__dirname, "../ta-match/build")));

const tempDir = "temp/";
const hostname = "127.0.0.1";
const port = process.env.PORT || 5000;

if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
}

const admin = require("firebase-admin");
const serviceAccount = require("./ta-match-gcp-service-key.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const parseSpreadsheets = require("./parse-spreadsheets.js");
const { exit } = require("process");
const parseProfData = parseSpreadsheets.parseProfData;
const parseApplicantsData = parseSpreadsheets.parseApplicantsData;
const buildProfsObj = parseSpreadsheets.buildProfsObj;

// buildProfsObj("summer", 2021);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, tempDir);
    },

    // By default, multer removes file extensions so let's add them back
    filename: function (req, file, cb) {
        cb(
            null,
            file.fieldname + "-" + "temp" + path.extname(file.originalname)
        );
    },
});

// Upload enpoint for all applicants data
app.post("/api/uploadApplicantsFile", function (req, res) {
    let upload = multer({ storage: storage }).single("ApplicantsFile");

    upload(req, res, function (err) {
        console.log(req.file);
        parseApplicantsData(req.body.semester, req.body.year);
        res.status(200).send({ data: "Successful upload" });
    });
});
const db = admin.firestore();

//when a user signs up, add them into firestore with their first+last name and user type
app.post("/api/signup", async (req, res) => {
    const fname = req.body.fname;
    const lname = req.body.lname;
    const type = req.body.type;
    const email = req.body.email;

    const newSignup = db.collection("users").doc(email);
    try {
        await newSignup.set({
            fname: fname,
            lname: lname,
            type: type,
        });
        res.send("success");
    } catch (err) {
        console.log(err);
    }
});

//retrieve user type based on email used to signin to determine proper routing page
app.get("/api/signin/:email", async (req, res) => {
    const email = req.params.email;
    try {
        const type = await db.collection("users").doc(email).get();
        res.send(type.data().type);
    } catch (err) {
        console.log(err);
    }
});

app.get("/api/getApplicantData/:email", async (req, res) => {
    const email = req.params.email;
   
    try {
        let profs = await buildProfsObj("summer", 2021)
        res.send(profs[email])
        
    } catch (err) {
        console.log(err);
    }
});


app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../ta-match/build/index.html"));
});

// Upload enpoint for all instructors data
app.post("/api/uploadInstructorsFile", function (req, res) {
    let upload = multer({ storage: storage }).single("InstructorsFile");

    upload(req, res, function (err) {
        console.log(req.file);
        parseProfData();
        res.status(200).send({ data: "Successful upload" });
    });
});

app.post("/api/addQuestionsForTA", async (req, res) => {
    const semester = req.body.semester;
    const courseName = req.body.courseName;
    const questions = req.body.questions;

    try {
        const type = await db
            .collection("courses")
            .doc(semester)
            .collection("courses")
            .doc(courseName)
            .update({ questions: questions });
        console.log(type);
        res.send("return");
    } catch (err) {
        console.log(err);
    }
});

app.listen(port, hostname, () => {
    console.log("Listening on: " + port);
});
