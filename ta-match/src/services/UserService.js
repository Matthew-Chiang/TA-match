export async function checkUser(email) {

    const response = await fetch(`/api/signin/${email}`);
    //console.log(response.json)
    return response.text();
}

export async function createUser(email, fname, lname, type) {
    const response = await fetch(`/api/signup`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            "fname": fname,
            "lname": lname,
            "type": type,
            "email": email
        })
      })
    return response;
}