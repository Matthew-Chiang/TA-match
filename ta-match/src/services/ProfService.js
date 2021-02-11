export async function getApplicantData(email) {
    const response = await fetch(`http://localhost:5000/api/getApplicantData/${email}`);
    const data = await response.json()
    return data;
}