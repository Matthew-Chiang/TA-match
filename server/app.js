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
const allocateTAsFile = require("./allocate-tas.js");
const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require("constants");
const parseProfData = parseSpreadsheets.parseProfData;
const parseApplicantsData = parseSpreadsheets.parseApplicantsData;
const buildProfsObj = parseSpreadsheets.buildProfsObj;
const allocateTAs = allocateTAsFile.allocateTAs;

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
        res.send(err);
    }
});

//retrieve user type based on email used to signin to determine proper routing page
app.get("/api/signin/:email", async (req, res) => {
    const email = req.params.email;
    try {
        const type = await db.collection("users").doc(email).get();
        res.send(type.data().type);
    } catch (err) {
        res.send(err);
    }
});

app.get("/api/getApplicantData/:email", async (req, res) => {
    const email = req.params.email;

    try {
        let profs = await buildProfsObj("summer", 2021);
        if (profs[email]){
            res.send(profs[email]);
        }
        else{
            res.send({});
        }
        
    } catch (err) {
        console.log(err);
    }
});

app.get("/api/allocateTAs/", async (req, res) => {
    const semester = req.query.semester ? req.params.semester : 'summer2021';
    const preference = req.query.preference;

    try {
        let profs = await allocateTAs(semester, preference);
        res.status(200).send('success');
    } catch (err) {
        res.status(404).send({err:err});
    }
});

//populate professorr TA rankings into the db
app.post("/api/rank", async (req,res)=>{
    const course = req.body.course;
    const applicantEmail = req.body.email;
    let rank;
    if(req.body.rank==0){
        rank = "Unranked"
    }
    else{rank = req.body.rank}
    const semester = req.body.sem
    let count = 0;

    try{
        const check = await db.collection("courses")
            .doc(semester).collection("courses")
            .doc(course).collection("applicants").get()
        check.forEach(a=>{
            console.log(a.data())
            if(a.id != applicantEmail && a.data().profRank != "Unranked" && a.data().profRank == rank){
                count++;
                res.status(404).send("Cannot assign same rank to multiple applicants")
            }
        })
        if(count ==0){
            const update = db
            .collection("courses")
            .doc(semester)
            .collection("courses")
            .doc(course)
            .collection("applicants")
            .doc(applicantEmail)
            .update({profRank: rank});
        console.log(update)
        res.send("success")
        }else{res.status(404).send("Cannot assign same rank to multiple applicants")}
    } catch(err){
        res.send(err)
    }
})

//calculate and populate the recommended TA hours into the db
app.post("/api/calcHours", async (req, res) =>{
    const sem = req.body.sem;
    const calcHours = req.body.hours;
    let calculation = [];

    try{
        calcHours.map((e) => {
            if(e["Course"]){
                e["Course"] = e["Course"].replace(/\s/g,'')
                if(!e["Hrs 2020"]){
                    e["Hrs 2020"] = 0;
                }
                let num = Math.ceil((e["Hrs 2020"]/e["Enrol 2020"])*e["Enrol 2021"])
                if(isNaN(num)){
                    num = 0;
                }
                calculation.push({
                    "course":e["Course"],
                    "ta_hours":num
                })
            }
        })
        calculation.forEach((a)=>{
            const hours = db.collection("testCourse").doc(sem).collection("courses").doc(a["course"])
            hours.set({ta_hours : a["ta_hours"]})
        })
        res.send('success')
    }catch(err){
        res.send(err)
    }
})
      

app.get("/api/test/:course/:sem", async (req,res)=>{
    const course = req.params.course
    const sem = req.params.sem
    try{
        const x = await db.collection("courses")
        .doc(sem).collection("courses")
        .doc(course).collection("applicants").get()
    x.forEach(a=>{
        console.log(a.id)
    })
    res.send('e')
 } catch(err){
        console.log(err)
    }
})

//retrieve all TA hours
app.get("/api/getHours/:sem",async (req,res)=>{
    const sem = req.params.sem;
    let hours = [];

    try{
        const find = await db.collection("testCourse").doc(sem).collection("courses").get()
        find.forEach((e)=>{
            hours.push({
                "course":e.id,
                "ta_hours":e.data().ta_hours
            })
        })
        res.send(hours)
    } catch(err){
        console.log(err)
    }
})

//update the ta hours for a specific course based on chair override
app.put("/api/updateHours", async (req,res)=>{
    const course = req.body.course;
    const hours = req.body.hours;
    const sem = req.body.sem;

    try{
        await db.collection("testCourse").doc(sem).collection("courses").doc(course)
        .update({ta_hours:hours})
        res.send("success")
    } catch(err){
        console.log(err)
    }
})

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

//export professor questions into excel file
app.get("/api/questions/:semester", async (req, res) => {
    const semester = req.params.semester;
    let response = [];
    const viewers = [
        { course: 1, question1: "1", question2: "2" },
        { course: 2, question1: "1", question2: "2", question3: "3" },
    ];
    try {
        const questionsCollection = await db
            .collection("courses")
            .doc(semester)
            .collection("courses")
            .get();
        let fields = [];
        questionsCollection.forEach((doc) => {
            fields = Object.keys(doc.data());
            let questions = doc.data();

            questionsWithCourseID = {
                course: doc.id,
                questions: questions.questions,
            };

            response.push(questionsWithCourseID);
        });
        res.json(response);
    } catch (err) {
        console.log(err);
    }
});

app.listen(port, hostname, () => {
    console.log("Listening on: " + port);
});
