const fs = require("fs");
const csv = require('csv-parser');
const admin = require('firebase-admin');

const db = admin.firestore();

// Read in profs data from temp folder and write to DB
function parseProfData(){
    const sheet = [];
    fs.createReadStream('./temp/InstructorsFile-temp.csv')
    .pipe(csv())
    .on('data', (data) => sheet.push(data))
    .on('end', () => {

        sheet.forEach(prof => {
            const courses = [];
            var nameKey = '';
            var emailKey = '';

            Object.keys(prof).forEach(key =>{
                if (key.toLowerCase().includes("course") && prof[key] != ''){ // Check how many course prof teaches 
                    courses.push(prof[key]);
                }

                else if (key.toLowerCase().includes("name")){ // Get header for instructor name
                    nameKey = key; 
                }
                else if (key.toLowerCase().includes("email")){ // Get header for instructor email
                    emailKey = key; 
                }
            });

            const profDoc = db.collection('profs').doc(prof[emailKey]);
            profDoc.set({
                name: prof[nameKey],
                courseList: courses
            });
        });
    });   
}

// Read in applicants data from temp folder and write to DB
async function parseApplicantsData(){
    const sheet = [];
    fs.createReadStream('./temp/ApplicantsFile-temp.csv')
    .pipe(csv())
    .on('data', (data) => {
        sheet.push(data);
    })
    .on('end', async (end) => {
        existingCourses = [];
        const questionKeys = [];
        const answerKeys = [];
        var courseCodeKey = '';
        var rankKey = '';
        var nameKey = '';
        var emailKey = '';
        var fundableKey = '';

        Object.keys(sheet[0]).forEach((key) => {
            if (key.toLowerCase().includes("code")){ // Get key for course code
                courseCodeKey = key;
            }
            else if (key.toLowerCase().includes("name")){ // Get header for applicant name
                nameKey = key; 
            }            
            else if (key.toLowerCase().includes("rank")){ // Get header for applicant ranking of course
                rankKey = key; 
            }
            else if (key.toLowerCase().includes("email")){ // Get header for applicant email
                emailKey = key; 
            }                
            else if (key.toLowerCase().includes("status")){ // Get header for applicant funability
                fundableKey = key; 
            }                
            else if ((key.toLowerCase().includes("q") && key.length < 4) || key.toLowerCase().includes("question")){ // Get header questions
                questionKeys.push(key);
            }                
            else if ((key.toLowerCase().includes("a") && key.length < 4) || key.toLowerCase().includes("answer")){ // Get header for applicant answers
                answerKeys.push(key);
            }
        });

        for (i = 0; i < sheet.length; i++){
            applicant = sheet[i];

            const coursesCol = db.collection('courses');

            var courseRef = await coursesCol.doc(applicant[courseCodeKey]).get();

            data = {};
            applicantsList = [];
            newApplicant = {};

            for (j = 0; j < questionKeys.length; j++){
                key = questionKeys[j];

                if (applicant[key] == "") continue;

                data[`question${j+1}`] = applicant[key];
                key = answerKeys[j];
                newApplicant[`answer${j+1}`] = applicant[key];
            }

            newApplicant['name'] = applicant[nameKey];
            newApplicant['email'] = applicant[emailKey];
            newApplicant['fundable'] = applicant[fundableKey];
            newApplicant['rank'] = applicant[rankKey];

            if (!courseRef.exists){
                applicantsList.push(newApplicant);
                data['applicant_list'] = applicantsList;
                success = await coursesCol.doc(applicant[courseCodeKey]).set(data);
            }
            else{
                applicantsList = courseRef.data().applicant_list;
                applicantsList.push(newApplicant);
                coursesCol.doc(applicant[courseCodeKey]).update({applicant_list: applicantsList});
            }
        }
    });   
}

// Resolve to Obejct with all profs and their courses & TA applicants
async function buildProfsObj(){
    tempProfsObj = {};
    profsObj = {};
    tempCoursesObj = {};

    const profsRef = await db.collection('profs').get();
    const coursesRef = await db.collection('courses').get();

    profsRef.forEach((prof)=>{
        tempProfsObj[prof.id] = prof.data();
    });
    console.log(tempProfsObj);    
    
    coursesRef.forEach((course)=>{
        tempCoursesObj[course.id] = course.data();
    });

    profsObj = tempProfsObj;
    Object.keys(tempProfsObj).forEach((prof) => {
        
        for (i = 0; i < tempProfsObj[prof].courseList.length; i++){
            courseCode = tempProfsObj[prof].courseList[i];

            profsObj[prof].courseList[i] = tempCoursesObj[courseCode];
            profsObj[prof].courseList[i]["course_code"] = courseCode;
        }
    });

    return profsObj;
}

exports.parseProfData = parseProfData;
exports.parseApplicantsData = parseApplicantsData;
exports.buildProfsObj = buildProfsObj;
