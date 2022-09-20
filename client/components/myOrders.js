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


window.addEventListener('load',orderFetcher)