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

//----checking for the summer semester----
var today = new Date();
var year = today.getFullYear()
var month = today.getMonth()+1;
if(month >= 1 && month <= 4){
    month = "winter";
}
else if(month >= 5 && month <= 8){
    month = "summer";
}
else{
    month = "fall";
}
//-----------------------------------------

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
        // console.log(req.file);
        //@leslie: check
        parseApplicantsData(month+year);
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
        //const send = type.data().type;
        res.send(type.data().type);
    } catch (err) {
        res.send(err);
    }
});

app.get("/api/getAllApplicantData", async (req, res) => {
    try {
        //@leslie: check
        let profs = await buildProfsObj(month+year);

        // sends information back about what term we're looking at
        // changing the above line should also change the line below
        //@leslie: check
        const responseObj = { profs, semester: `${month} ${year}` };
        res.send(responseObj);
    } catch (err) {
        console.log(err);
    }
});

app.get("/api/getApplicantData/:email", async (req, res) => {
    const email = req.params.email;

    try {
        //@leslie: check
        let profs = await buildProfsObj(month+year);
        // sends information back about what term we're looking at
        // changing the above line should also change the line below
        if (profs[email]) {
            //@leslie: check
            const responseObj = { ...profs[email], semester: `${month} ${year}` };
            res.send(responseObj);
        } else {
            res.send({});
        }
    } catch (err) {
        console.log(err);
    }
});

app.get("/api/allocateTAs/", async (req, res) => {
    //@leslie: check
    const semester = req.query.semester ? req.params.semester : month+year;
    const preference = req.query.preference;

    try {
        let profs = await allocateTAs(semester, preference);
        res.status(200).send("success");
    } catch (err) {
        res.status(404).send({ err: err });
    }
});

//populate professorr TA rankings into the db
app.post("/api/rank", async (req, res) => {
    const course = req.body.course;
    const applicantEmail = req.body.email;
    //@leslie: check
    const semester = month+year;
    let rank;
    
    if (req.body.rank == 0) {
        rank = "Unranked";
    } else {
        rank = req.body.rank;
    }
    
    let count = 0;

    try {
        const check = await db
            .collection("courses")
            .doc(semester)
            .collection("courses")
            .doc(course)
            .collection("applicants")
            .get();
        check.forEach((a) => {
            // console.log(a.data());
            if (
                a.id != applicantEmail &&
                a.data().profRank != "Unranked" &&
                a.data().profRank == rank
            ) {
                count++;
                res.status(404).send(
                    "Cannot assign same rank to multiple applicants"
                );
            }
        });
        if (count == 0) {
            const update = db
                .collection("courses")
                .doc(semester)
                .collection("courses")
                .doc(course)
                .collection("applicants")
                .doc(applicantEmail)
                .update({ profRank: rank });
            // console.log(update);
            res.send("success");
        } else {
            res.status(404).send(
                "Cannot assign same rank to multiple applicants"
            );
        }
    } catch (err) {
        console.log(err);
        res.send(err);
    }
});

//calculate and populate the recommended TA hours into the db
app.post("/api/calcHours", async (req, res) => {
    const sem = month+year;
    const calcHours = req.body.hours;

    let calculation = [];
    let valid = 0;

    try {
        await calcHours.map((e) => {
            if (typeof e["Instructor"] !== "undefined" && typeof e["Course"] !== "undefined" && typeof e["Enrol 2020"] !== "undefined" && typeof e["Enrol 2021"] !== "undefined" && typeof e["Hrs 2021"] !== "undefined") {
                valid++;
            }
        })
        console.log(valid)
        if (valid > 0) {
            await calcHours.map((e) => {
                if (e["Course"] && !((e["Course"]).includes("/"))) {
                    e["Course"] = e["Course"].replace(/\s/g, "");
                    if (!e["Hrs 2020"]) {
                        e["Hrs 2020"] = 0;
                    }
                    let num = Math.ceil(
                        ((e["Hrs 2020"] / e["Enrol 2020"]) * e["Enrol 2021"])/5
                    )*5;
                    if (isNaN(num)) {
                        num = 0;
                    }
                    calculation.push({
                        course: e["Course"],
                        ta_hours: num,
                        instructor: e["Instructor"],
                    });
                }
            });

            await calculation.forEach((a) => {
                const hours = db
                    .collection("courses")
                    .doc(sem)
                    .collection("courses")
                    .doc(a["course"]);
    
                hours.set({ ta_hours: a["ta_hours"], instructor: a["instructor"] });
            });
            res.send("success");
        }
        else {
            res.status(400).send("error");
        }
    } catch (err) {
        res.send(err);
    }
});


//test function to delete later i think
app.get("/api/test/:course/:sem", async (req, res) => {
    const course = req.params.course;
    const sem = req.params.sem;
    try {
        const x = await db
            .collection("courses")
            .doc(sem)
            .collection("courses")
            .doc(course)
            .collection("applicants")
            .get();
        x.forEach((a) => {
            console.log(a.id);
        });
        res.send("e");
    } catch (err) {
        console.log(err);
    }
});

//retrieve all TA hours
app.get("/api/getHours", async (req, res) => {
    //@leslie: check
    const sem = month+year;
    let hours = [];

    try {
        const find = await db
            .collection("courses")
            .doc(sem)
            .collection("courses")
            .get();
        find.forEach((e) => {
            hours.push({
                course: e.id,
                ta_hours: e.data().ta_hours,
            });
        });
        res.send(hours);
    } catch (err) {
        console.log(err);
    }
});

//update the ta hours for a specific course based on chair override
app.put("/api/updateHours", async (req, res) => {
    const course = req.body.course;
    const hours = req.body.hours;
    //@leslie: check
    const sem = month+year;

    try {
        await db
            .collection("courses")
            .doc(sem)
            .collection("courses")
            .doc(course)
            .update({ ta_hours: hours });
        res.send("success");
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
    //@leslie: check
    const semester = month+year;
    const courseName = req.body.courseName;
    const questions = req.body.questions;

    try {
        const type = await db
            .collection("courses")
            .doc(semester)
            .collection("courses")
            .doc(courseName)
            .update({ questions: questions });
        res.send("return");
    } catch (err) {
        console.log(err);
    }
});

//export professor questions into excel file
app.get("/api/questions/:semester", async (req, res) => {
    const semester = req.params.semester;
    let response = [];

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

            if (questions.questions) {
                questionsWithCourseID = {
                    course: doc.id,
                    questions: questions.questions,
                };

                response.push(questionsWithCourseID);
            }
        });
        res.json(response);
    } catch (err) {
        console.log(err);
    }
});

//get all past professor questions
app.get("/api/pastQuestions/:professor", async (req, res) => {
    const email = req.params.professor;
    let response = [];

    try {
        const questionSnapshot = await db
            .collectionGroup("courses")
            .where("instructor", "==", email)
            .get();

        questionSnapshot.forEach((doc) => {
            const documentQuestions = doc.data().questions;
            if (documentQuestions) {
                response.push(...documentQuestions);
            }
        });

        res.json(response);
    } catch (err) {
        console.log(err);
    }
});

app.post("/api/allocation/changeStatus/:email", async (req, res) => {
    const email = req.params.email;
    const semester = req.body.semester;
    const courseName = req.body.courseName;
    const newStatus = req.body.newStatus;

    try {
        const allocation = await db
            .collection("courses")
            .doc(semester)
            .collection("courses")
            .doc(courseName)
            .collection("allocation")
            .doc(email)
            .update({ status: newStatus });
        res.send("return");
    } catch (err) {
        console.log(err);
    }
});

app.post("/api/updateTaHours", async (req, res) => {
    const hours = parseInt(req.body.hours);
    const TaEmail = req.body.TaEmail;
    const courseName = req.body.course;
    const semester = req.body.semester;
    try {
        const allocation = await db
            .collection("courses")
            .doc(semester)
            .collection("courses")
            .doc(courseName)
            .collection("allocation")
            .doc(TaEmail)
            .update({ hours_allocated: hours });
        res.send("return");
        
    } catch (err) {
        console.log(err);
    }
});

app.post("/api/allocation/add", async (req, res) => {
    const semester = req.body.semester;
    const courseName = req.body.courseName;
    const email = req.body.email;
    const hours = parseInt(req.body.hours);
    try {
        const allocation = await db
            .collection("courses")
            .doc(semester)
            .collection("courses")
            .doc(courseName)
            .collection("allocation")
            .doc(email)
            .set({ status: "pending", hours_allocated: hours});
        res.send("return");
    } catch (err) {
        console.log(err);
    }
});

app.delete("/api/allocation/delete", async (req, res) => {
    const semester = req.body.semester;
    const courseName = req.body.courseName;
    const email = req.body.email;

    try {
        const allocation = await db
            .collection("courses")
            .doc(semester)
            .collection("courses")
            .doc(courseName)
            .collection("allocation")
            .doc(email)
            .delete();
        res.send("return");
    } catch (err) {
        console.log(err);
    }
});

app.get("/api/semester/:semester", async (req, res) => {
    const semester = req.params.semester;
    let response = [];
    let courseIDs = [];
    let courseData = [];

    const coursesCollection = await db.collection('courses').doc(semester).collection('courses').get();
    console.log(coursesCollection)
    coursesCollection.forEach(doc => {
        courseIDs.push(doc.id);
        courseData.push(doc.data());
    })
    for(let i=0; i<courseIDs.length; i++) {
        let courseTAs = [];
        let hoursAlloc = [];
        let courseApplicants = [];
        let applicantNames = [];
        const allocationsCollection = await db.collection('courses').doc(semester).collection('courses').doc(courseIDs[i]).collection('allocation').get();
        allocationsCollection.forEach(ta => {
            courseTAs.push(ta.id);
            hoursAlloc.push(ta.get("hours_allocated"))
        })
        
        const applicantsCollection = await db.collection('courses').doc(semester).collection('courses').doc(courseIDs[i]).collection('applicants').get();
        applicantsCollection.forEach(a => {
            courseApplicants.push(a.id);
            applicantNames.push(a.get("name"))
        })

        let courseDetails = {
            course: courseIDs[i],
            details: courseData[i],
            allocation: courseTAs,
            hours_allocated: hoursAlloc,
            applicants: courseApplicants,
            names: applicantNames
        }
        response.push(courseDetails);
    }
    if(response.length != 0) {
        res.json(response);
    }else {
        res.send("Semester does not exist!");
    }
});

app.get("/api/applicants/:semester/:course", async (req, res) => {
    const course = req.params.course;
    const semester = req.params.semester;
    let response = [];
    const applicantsCollection = await db.collection('courses').doc(semester).collection('courses').doc(course).collection('applicants').get();
    applicantsCollection.forEach(doc => {
        console.log(doc.id, '=>', doc.data());

        let applicantDetails = {
            applicant: doc.id,
            details: doc.data(),
        }
        response.push(applicantDetails);
    })
    if(response.length != 0) {
        res.json(response);
    }else {
        res.send("No applicants for course");
    }
})

app.listen(port, hostname, () => {
    console.log("Listening on: " + port);
});
