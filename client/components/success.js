
fetch("http://localhost:3000/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    }, 
    body: JSON.stringify(userObj)
    
  })
    .then(res => res.json())
    .then((data) => console.log(data))
    .then(setTimeout(() => {
        location.reload()
    }, 1000))