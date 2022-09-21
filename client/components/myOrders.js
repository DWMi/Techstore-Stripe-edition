



const main = document.querySelector('#main'),
    titleHeader = document.querySelector('#titleHeader'),
    shoppingCart = document.querySelector('#shoppingCart'),
    orderTitle = document.createElement('h1'),
    container = document.createElement('div'),
    order = document.createElement('span')

orderTitle.innerText = 'My Orders'


const init = async () => {
    let user = await checkLogIn()
    let order = await testFetcher(user)
    
    
    /*     main.append(container)
    container.append(orderTitle)
    container.append(order)  */
    
}

async function checkLogIn() {
    let url = "http://localhost:3000/checkLogin"
    let method = "GET"
    let result = await makeRequest(url, method, undefined)
    return result;

}

const testFetcher = async (user) => {
    try {
        let response = await fetch(`http://localhost:3000/my-orders/${user.id}`)
        let result = await response.json()
        console.log(result)

    } catch (err) {
        console.error(err);
    }
}







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

window.addEventListener('load', init)

titleHeader.addEventListener('click', () => {
    window.location.href = 'http://localhost:3000'
})

