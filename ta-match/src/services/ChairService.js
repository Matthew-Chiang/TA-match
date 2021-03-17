

export async function getHours() {
    const response = await fetch(`http://localhost:5000/api/getHours`);
    const data = await response.json()
    return data;
}