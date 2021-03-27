const fs = require("fs");
const csv = require("csv-parser");
const admin = require("firebase-admin");
var XLSX = require('xlsx')


const db = admin.firestore();


function parseProfData(month, year) {
    const sheet = [];

    // Build array of arrays for csv file
    var workbook = XLSX.readFile("./temp/InstructorsFile-temp.xlsx")
    var sheet_name_list = workbook.SheetNames;
    var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
    
    var nameKey = "";
    var emailKey = "";

    // Find relevant column names using likely substrings    
    Object.keys(xlData[0]).forEach((key) => {

        if (key.toLowerCase().includes("name")) { // Get header for instructor name
            nameKey = key;
        } else if (key.toLowerCase().includes("email")) { // Get header for instructor email
            emailKey = key;
        }
    });

    // Write profs data to db
    for (prof of xlData) {
        const profDoc = db.collection(`/courses/${month + year}/profs`).doc(prof[emailKey]); // Check if this needs to be async
        profDoc.set({
            name: prof[nameKey]
        });
    }
}

// Read in applicants data from temp folder and write to DB
async function parseApplicantsData(semester) {
    const sheet = [];

    // Build array of arrays for csv file
    fs.createReadStream("./temp/ApplicantsFile-temp.csv")
        .pipe(csv())
        .on("data", (data) => {
            sheet.push(data);
        })
        .on("end", async (end) => {
            existingCourses = [];
            const questionKeys = [];
            const answerKeys = [];
            var courseCodeKey = "";
            var rankKey = "";
            var hoursKey = "";
            var nameKey = "";
            var emailKey = "";
            var fundableKey = "";

            // Find relevant column names using likely substrings
            Object.keys(sheet[0]).forEach((key) => {
                if (key.toLowerCase().includes("code")) {
                    // Get key for course code
                    courseCodeKey = key;
                } else if (key.toLowerCase().includes("name")) {
                    // Get header for applicant name
                    nameKey = key;
                } else if (key.toLowerCase().includes("rank")) {
                    // Get header for applicant ranking of course
                    rankKey = key;
                } else if (key.toLowerCase().includes("email")) {
                    // Get header for applicant email
                    emailKey = key;
                } else if (key.toLowerCase().includes("status")) {
                    // Get header for applicant funability
                    fundableKey = key;
                } else if (
                    key.toLowerCase().includes("hrs") ||
                    key.toLowerCase().includes("hours")
                ) {
                    // Get header for hours availability
                    hoursKey = key;
                } else if (
                    (key.toLowerCase().includes("q") && key.length < 4) ||
                    key.toLowerCase().includes("question")
                ) {
                    // Get header questions
                    questionKeys.push(key);
                } else if (
                    (key.toLowerCase().includes("a") && key.length < 4) ||
                    key.toLowerCase().includes("answer")
                ) {
                    // Get header for applicant answers
                    answerKeys.push(key);
                }
            });

            // Iterate over rows (1 applicant per row) & extract data using keys above
            for (i = 0; i < sheet.length; i++) {
                applicant = sheet[i];

                const coursesCol = db.collection(
                    //@leslie: check
                    `courses/${semester}/courses`
                );

                var courseRef = await coursesCol
                    .doc(applicant[courseCodeKey])
                    .get();

                data = {};
                applicantsList = [];
                newApplicant = {};

                // these question answer pairs are decoupled from the questions on the course
                // the questions on the course represent what the professor input on his page
                // these pairs are what we get back from the spreadsheet
                // so theoretically they are the same but could be different if Western's system messes up
                const questionAnswerPairs = [];

                for (j = 0; j < questionKeys.length; j++) {
                    questionKey = questionKeys[j];
                    answerKey = answerKeys[j];

                    if (applicant[questionKey] == "") continue;

                    questionAnswerPairs.push({
                        question: applicant[questionKey],
                        answer: applicant[answerKey],
                    });
                }

                newApplicant["questionAnswerPairs"] = questionAnswerPairs;
                newApplicant["name"] = applicant[nameKey];
                newApplicant["fundable"] = applicant[fundableKey];
                newApplicant["rank"] = applicant[rankKey];
                newApplicant["availability"] = applicant[hoursKey];

                const applicantCol = db.collection(
                    //@leslie: check
                    `courses/${semester}/courses/${
                        applicant[courseCodeKey]
                    }/applicants`
                );

                // Add course and applicant if course doesnt exist
                if (!courseRef.exists) {
                    success = await coursesCol
                        .doc(applicant[courseCodeKey])
                        .set(data);
                    applicantCol.doc(applicant[emailKey]).set(newApplicant);
                } else {
                    applicantCol.doc(applicant[emailKey]).set(newApplicant);
                }
            }
        });
}

// Resolve to Obejct with all profs and their courses & TA applicants
async function buildProfsObj(semester) {
    profsList = [];
    coursesList = [];
    profsObj = {};

    const coursesRef = await db
    //@leslie: check
        .collection(`courses/${semester}/courses`)
        .get();

    // course per term
    coursesRef.forEach(async (course) => {
        tempCourse = course.data();
        tempCourse.course_code = course.id;
        coursesList.push(tempCourse);
    });

    // Add list of applicant objects to temp object
    for (i = 0; i < coursesList.length; i++) {
        course = coursesList[i];

        prof = course.instructor;
        prof in profsList ? {} : profsList.push(prof);

        courseId = course.course_code;
        applicantsList = [];
        const applicantsCol = await db
            .collection(
                //@leslie: check
                `courses/${semester}/courses/${courseId}/applicants`
            )
            .get();
        applicantsCol.forEach((applicant) => {
            newApplicant = applicant.data();
            newApplicant["email"] = applicant.id;
            applicantsList.push(newApplicant);
        });
        course.applicant_list = applicantsList;

        allocationsList = [];
        const allocationsCol = await db
            .collection(
                //@leslie: check
                `courses/${semester}/courses/${courseId}/allocation`
            )
            .get();

        allocationsCol.forEach((allocation) => {
            newAllocation = allocation.data();
            newAllocation["email"] = allocation.id;
            allocationsList.push(newAllocation);
        });
        course.allocation_list = allocationsList;
    }

    // Build final profs obj
    profsList.forEach((prof) => {
        profCourses = coursesList.filter(
            (course) => course.instructor === prof
        );

        profsObj[prof] = {};
        profsObj[prof].courseList = profCourses;
    });
    return profsObj;
}

exports.parseProfData = parseProfData;
exports.parseApplicantsData = parseApplicantsData;
exports.buildProfsObj = buildProfsObj;
