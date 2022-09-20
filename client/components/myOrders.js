const main = document.querySelector('#main'),
    titleHeader = document.querySelector('#titleHeader'),
    shoppingCart = document.querySelector('#shoppingCart'),
    orderTitle = document.createElement('h1'),
    container = document.createElement('div'),
    order = document.createElement('span')

    orderTitle.innerText = 'My Orders'

    const orderFetcher = ()=>{

            main.append(container)
            container.append(orderTitle)
            container.append(order)

        
    }
    
   

titleHeader.addEventListener('click',()=> {
   window.location.href = 'http://localhost:3000'
})



const testFetcher = async()=> {
    try {
        let response = await fetch ("http://localhost:3000/my-orders")
        let result = await response.json()
        console.log(result)

    } catch (err) {
        console.error(err);
    }
}
testFetcher

window.addEventListener('load',orderFetcher )
