const http = require("http");
const xlsx = require("xlsx");
const express = require('express');

const hostname = "localhost";
const port = 4200;

//const server = http.createServer((req, res) => {
//    res.statusCode = 200;
//    res.setHeader("Content-Type", "text/plain");
//    res.end("Hello World");
//}); 

const app = express();
const cors = require('cors');
const admin = require('firebase-admin');
const serviceAccount = require('./ta-match-key.json');

app.use(cors());

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

app.get('/api/questions/:semester', async (req, res) => {
    const semester = req.params.semester;
    let response = [];
    const viewers = [
        {course: 1, question1: '1', question2: '2'},
        {course: 2, question1: '1', question2: '2', question3: '3'}
    ]
    try {
        const questionsCollection = await db.collection('courses').doc(semester).collection('courses').get();
        let fields = [];
        questionsCollection.forEach(doc => {
            fields = Object.keys(doc.data());
            let questions = doc.data();
            console.log(questions);
            questionsWithCourseID = Object.assign({course: doc.id}, questions); //puts it into required format
            console.log(questionsWithCourseID);

            //console.log(fields.length);
            //console.log(fields);
            //questionsArray.push(doc.data());
            //response.push({course: doc.id, questions: questionsArray});
            response.push(questionsWithCourseID);
            //questionsArray.push(doc.data());
        })
        res.json(response);
    }catch(err) {
        console.log(err);
    }

})

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
