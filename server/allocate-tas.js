const admin = require("firebase-admin");

const db = admin.firestore();


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

//@leslie: check
async function allocateTAs(semester=month+year, preferenceWeighting=1){

    let hoursPerCourse = {};
    let coursesCol = await db.collection(`/courses/${semester}/courses/`).get();
    coursesCol.forEach(course => {
        let hoursTemp= course.data().ta_hours;
        hoursPerCourse[course.id] = Math.ceil(hoursTemp/5) * 5
    });

    // Build coursesObj with all necessary data for the allocation
    coursesObj = await buildCoursesObj(semester, preferenceWeighting);

    let allocatedList = []; // List to store TAs that have already been allocated


    let allocationObj = {}; // Output obj for {courseCode:[TAs]}

    let allocationOrder = Object.keys(coursesObj).sort((a, b) => a < b); // Sort courses alphabetically

    for (courseCode of allocationOrder){
        let hoursRequired = hoursPerCourse[courseCode];
        // console.log(courseCode);

        for (applicant of coursesObj[courseCode]){
            if (hoursRequired < 5) break; 
            if (allocatedList.includes(applicant.email)) continue;

            allocatedHours = Math.min(applicant.availability, hoursRequired);
            
            if (!allocationObj[courseCode]){
                allocationObj[courseCode] = [{email: applicant.email, hours: allocatedHours}];
            }
            else{
                allocationObj[courseCode].push({email: applicant.email, hours: allocatedHours});
            }

            hoursRequired -= applicant.availability;
            allocatedList.push(applicant.email);

        }
    }

    for (courseCode of Object.keys(allocationObj)){
        let allocationCol = db.collection(`/courses/${semester}/courses/${courseCode}/allocation`);

        for (ta of allocationObj[courseCode]){
            await allocationCol.doc(ta.email).set({
                status: 'pending',
                hours_allocated: ta.hours
            });
        }

    }

}


async function buildCoursesObj(semester, preferenceWeighting){
    const courseDocs = await db.collection(`/courses/${semester}/courses/`).get();
    const priortyRank = preferenceWeighting ? 'profRanking' : 'taRanking';
    const coursesList = []; 
    const coursesObj = {};

    
    courseDocs.forEach(doc => {
        coursesList.push(doc.id);
    }); 

    for (course of coursesList){
        let applicants = await db.collection(`/courses/${semester}/courses/${course}/applicants`).get();

        applicants.forEach(applicant => {
            let tempApplicant = {};
            tempApplicant.email = applicant.id;
            tempApplicant.name = applicant.data().name;
            tempApplicant.taRanking = applicant.data().rank;
            tempApplicant.ProfRanking = applicant.data().profRank;
            tempApplicant.status = applicant.data().fundable;
            tempApplicant.availability = applicant.data().availability;

            if (priortyRank == 'profRanking'){
                tempApplicant.realRanking = parseInt(tempApplicant.ProfRanking, 10);
            }

            if (!coursesObj[course]){
                coursesObj[course] = [tempApplicant];
            }
            else{
                coursesObj[course].push(tempApplicant);
            }
        }); 

        // Handle case with ranking by taRanking and then by profRanking
        let applicantsList = coursesObj[course];
        if (priortyRank == 'taRanking'){
            applicantsList.sort((a, b) => a.taRanking - b.taRanking || a.ProfRanking - b.ProfRanking);

            for (applicant of applicantsList){
                applicant.realRanking = applicantsList.indexOf(applicant) + 1;
            }
        }

        // Account for status
        let numApplicants = applicantsList.length; 
        for (applicant of applicantsList){
            applicant.realRanking = applicant.realRanking + numApplicants * (applicant.status - 1);
        }
        applicantsList.sort((a, b) => a.realRanking - b.realRanking);
    }

    return coursesObj;
}

exports.allocateTAs = allocateTAs;

