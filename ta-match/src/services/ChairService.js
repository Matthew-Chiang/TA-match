export async function postCalcHours(hours) {
    const response = await fetch(`http://localhost:5000/api/calcHours`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            hours: hours
        }),
    });
    return response;
}

export async function updateCalcHours(course, hours) {
    const response = await fetch(`http://localhost:5000/api/updateHours`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            course: course,
            hours: hours
        }),
    });
    return response;
}

export async function getHours() {
    const response = await fetch(`http://localhost:5000/api/getHours`);
    const data = await response.json()
    return data;
}