

export async function makeRequest(url, method, body) {
    try {
        let response = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json"
            },
            body
        })
        let result = await response.json()
        return result;
        
    } catch (err) {
        console.error(err);
    }
}

export async function checkLogIn() {
    let url = "http://localhost:3000/user/checkLogin"
    let method = "GET"
    let result = await makeRequest(url, method, undefined)
    return result;
}