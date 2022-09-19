


let params = new URLSearchParams(window.location.search)
let id = params.get('session_id')

fetch("http://localhost:3000/checkout/session?id=" + id)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        JSON.stringify(data)
        console.log(data)
    });

console.log(id)