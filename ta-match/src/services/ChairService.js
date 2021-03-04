export async function postCalcHours(sem, hours) {
    const response = await fetch(`http://localhost:5000/api/calcHours`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            sem: sem,
            hours: hours
        }),
    });
    return response;
}

export async function updateCalcHours(sem, course, hours) {
    const response = await fetch(`http://localhost:5000/api/updateHours`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            sem: sem,
            course: course,
            hours: hours
        }),
    });
    return response;
}

export async function getHours(sem) {
    const response = await fetch(`http://localhost:5000/api/getHours/${sem}`);
    const data = await response.json()
    return data;
}