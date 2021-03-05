const fs = require("fs");
const csv = require("csv-parser");
const admin = require("firebase-admin");

const db = admin.firestore();

// Read in profs data from temp folder and write to DB
function parseProfData() {
    const sheet = [];

    // Build array of arrays for csv file
    fs.createReadStream("./temp/InstructorsFile-temp.csv")
        .pipe(csv())
        .on("data", (data) => sheet.push(data))
        .on("end", () => {
            sheet.forEach((prof) => {
                const courses = [];
                var nameKey = "";
                var emailKey = "";

                // Find relevant column names using likely substrings
                Object.keys(prof).forEach((key) => {
                    if (
                        key.toLowerCase().includes("course") &&
                        prof[key] != ""
                    ) {
                        // Check how many course prof teaches
                        courses.push(prof[key]);
                    } else if (key.toLowerCase().includes("name")) {
                        // Get header for instructor name
                        nameKey = key;
                    } else if (key.toLowerCase().includes("email")) {
                        // Get header for instructor email
                        emailKey = key;
                    }
                });

                // Write profs data to db
                const profDoc = db.collection("profs").doc(prof[emailKey]);
                profDoc.set({
                    name: prof[nameKey],
                    courseList: courses,
                });
            });
        });
}

// Read in applicants data from temp folder and write to DB
async function parseApplicantsData(semester, year) {
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
                }  else if (key.toLowerCase().includes("hrs") ||
                            key.toLowerCase().includes("hours"))
                {
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
                    `courses/${semester + year}/courses`
                );

                var courseRef = await coursesCol
                    .doc(applicant[courseCodeKey])
                    .get();

                data = {};
                applicantsList = [];
                newApplicant = {};

                const questions = [];
                const answers = [];

                for (j = 0; j < questionKeys.length; j++) {
                    key = questionKeys[j];

                    if (applicant[key] == "") continue;

                    // data[`question${j+1}`] = applicant[key];
                    questions.push(applicant[key]);
                    key = answerKeys[j];
                    // answers.push(applicant[key])
                    newApplicant[`answer${j + 1}`] = applicant[key];
                }

                // data["questions"] = questions;
                newApplicant["name"] = applicant[nameKey];
                newApplicant["fundable"] = applicant[fundableKey];
                newApplicant["rank"] = applicant[rankKey];
                newApplicant["availability"] = applicant[hoursKey];

                const applicantCol = db.collection(
                    `courses/${semester + year}/courses/${
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
async function buildProfsObj(semester, year) {
    tempProfsObj = {};
    profsObj = {};
    tempCoursesObj = {};

    const profsRef = await db.collection("profs").get();
    const coursesRef = await db
        .collection(`courses/${semester + year}/courses`)
        .get();

    // Build temporary courses and prof objects
    profsRef.forEach((prof) => {
        tempProfsObj[prof.id] = prof.data();
    });
    // couse per term
    coursesRef.forEach(async (course) => {
        tempCoursesObj[course.id] = course.data();
    });

    // Add list of applicant objects to temp object
    courseIds = Object.keys(tempCoursesObj);
    for (i = 0; i < courseIds.length; i++) {
        courseId = courseIds[i];
        applicantsList = [];
        const applicantsCol = await db
            .collection(
                `courses/${semester + year}/courses/${courseId}/applicants`
            )
            .get();

        applicantsCol.forEach((applicant) => {
            newApplicant = applicant.data();
            newApplicant["email"] = applicant.id;
            applicantsList.push(newApplicant);
        });
        tempCoursesObj[courseId].applicant_list = applicantsList;

        allocationsList = [];
        const allocationsCol = await db
            .collection(
                `courses/${semester + year}/courses/${courseId}/allocation`
            )
            .get();

        allocationsCol.forEach((allocation) => {
            newAllocation = allocation.data();
            newAllocation["email"] = allocation.id;
            allocationsList.push(newAllocation);
        });
        tempCoursesObj[courseId].allocation_list = allocationsList;
    }

    // Build final profs obj
    profsObj = tempProfsObj;
    Object.keys(tempProfsObj).forEach((prof) => {
        for (i = 0; i < tempProfsObj[prof].courseList.length; i++) {
            courseCode = tempProfsObj[prof].courseList[i];

            profsObj[prof].courseList[i] = tempCoursesObj[courseCode];
            profsObj[prof].courseList[i]["course_code"] = courseCode;
        }
    });
    console.log(JSON.stringify(profsObj));
    return profsObj;
}

exports.parseProfData = parseProfData;
exports.parseApplicantsData = parseApplicantsData;
exports.buildProfsObj = buildProfsObj;
