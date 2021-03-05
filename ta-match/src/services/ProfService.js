export async function getApplicantData(email) {
    const response = await fetch(`http://localhost:5000/api/getApplicantData/${email}`);
    const data = await response.json()
    return data;
}

export async function postRank(course, email, rank, sem){
    const response = await fetch(`http://localhost:5000/api/rank`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            course: course,
            email: email,
            rank: rank,
            sem: sem
        }),
    });
    console.log(response)
    return response
}

