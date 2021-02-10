const http = require("http");
const express = require('express');
const bodyParser = require("body-parser");
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());
var urlParser = bodyParser.urlencoded({extended: false})
app.use(bodyParser.urlencoded({ extended: false}));

app.use((req, res, next) => { // for all routes
    console.log(`${req.method} request for ${req.url}`);
    next(); // keep going
});

const hostname = "127.0.0.1";
const port = 3000;

// const server = http.createServer((req, res) => {
//     res.statusCode = 200;
//     res.setHeader("Content-Type", "text/plain");
//     res.end("Hello World!");
// });

const admin = require('firebase-admin');
const serviceAccount = require('./ta-match-gcp-service-key.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

//when a user signs up, add them into firestore with their first+last name and user type
app.post('/api/signup', async (req,res) => {
    const fname = req.body.fname;
    const lname = req.body.lname;
    const type = req.body.type;
    const email = req.body.email;

    const newSignup = db.collection('users').doc(email);
    try{
        await newSignup.set({
            'fname': fname,
            'lname': lname,
            'type': type
        });
        res.send("success")
    } catch(err) {console.log(err)}
})

//retrieve user type based on email used to signin to determine proper routing page
app.get('/api/signin/:email', async (req,res) => {
    const email = req.params.email;
    try{
        const type = await db.collection('users').doc(email).get();
        res.send(type.data().type)
    } catch(err){console.log(err)}  
})

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
