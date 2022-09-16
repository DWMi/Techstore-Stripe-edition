
var itemsData;
let priceArr;
let shoppingCart;
if(localStorage.getItem('products')) {
     shoppingCart = JSON.parse(localStorage.getItem('products'))
}else{
     shoppingCart = [];
}
var isItemsViewVisible = false;



/* Fetch data from the json file into a javascript object */
fetch("http://localhost:3000/products")
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        itemsData = data;
        getProductPrices()
    });

// FETCH PRICES
function getProductPrices() {
    fetch("http://localhost:3000/prices")
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            let prices = data;
            priceArr = prices.data
            createUIFromLoadedItemsData();
        });

        let totalQty = localStorage.getItem('quantity')
        counter = document.querySelector("#counter");
        counter.innerText = totalQty 
}

/* Use the data to create a list of these object on your website */
function createUIFromLoadedItemsData() {
    if (isItemsViewVisible) { return; }
    isItemsViewVisible = true;

    /* Create a list of the products */
    var list = document.createElement("ul");


    itemsData.data.forEach(product => {
        let priceObj = priceArr.find(price => price.id == product.default_price)
        list.appendChild(createListItem(product, priceObj))
    });


    /* Add the list to the DOM */
    var container = document.querySelector("#main");
    if (container.firstChild) {
        container.replaceChild(list, container.firstChild);
    } else {
        container.appendChild(list);
    }
}

function createListItem(product, priceObj) {

    /* Title */
    var title = document.createElement("h3");
    title.innerText = product.name;

    /* Description */
    var description = document.createElement("p");
    description.innerText = product.description;

    /* Image */
    var image = document.createElement("img");
    image.src = product.images[0]

    /* Price */

    let priceString = priceObj.unit_amount.toString()
    if (priceObj) {
        var price = document.createElement("span");
        price.innerText = `${priceString.substring(0, priceString.length - 2)} kr`
    }

    /* Button */
    var button = document.createElement("button");
    button.innerHTML = '<i class="fa fa-cart-arrow-down" aria-hidden="true"></i>' + "&nbsp;&nbsp;&nbsp;" + "Lägg till i kundvagnen";

    button.onclick = function () {
        localStorage.setItem('products', JSON.stringify(shoppingCart))
        let totalQty = localStorage.getItem('quantity')
        totalQty = parseInt(totalQty)
        let exist = shoppingCart.find(item => item.id == product.id)

        //Add to localStorage cart
        if (exist) {
            exist.qty += 1
            localStorage.setItem('products', JSON.stringify(shoppingCart))
        } else {
            shoppingCart.push({ ...product, qty: 1, price: priceObj.unit_amount});
            localStorage.setItem('products', JSON.stringify(shoppingCart))
        }

        //add to totalQty in cart
        if (totalQty) {
            counter = document.querySelector("#counter");
            localStorage.setItem('quantity', totalQty + 1)
            counter.innerText = totalQty + 1
        } else {
            localStorage.setItem('quantity', 1)
            counter = document.querySelector("#counter");
            counter.innerText = 1
        }

    };

    var item = document.createElement("li");
    item.appendChild(title);
    item.appendChild(description);
    item.appendChild(image);
    item.appendChild(price);
    item.appendChild(button);

    return item;
}


function showShoppingCart() {
    if (!isItemsViewVisible) { return; }
    isItemsViewVisible = false;

    /* Header */
    var header = document.createElement("h2");
    header.innerHTML = '<i class="fa fa-shopping-cart" aria-hidden="true"></i>' + " Kundvagn";

    /* Shopping list */
    var list = document.createElement("ul");

    shoppingCart = JSON.parse(localStorage.getItem('products'))
    shoppingCart.forEach(product => {
        list.appendChild(createShoppingCartItem(product));
    });
 
    /* Shopping info & action */
    var info = createShoppingSummary();

    var content = document.createElement("div");
    content.appendChild(header);
    content.appendChild(list);
    content.appendChild(info);

    var container = document.querySelector("#main");
    container.replaceChild(content, container.firstChild);
}

function createShoppingCartItem(product) {
    /* Image */
    var image = document.createElement("img");
    image.src = product.images[0]

    /* Title */
    var title = document.createElement("h3");
    title.innerText = product.name

    /* Price */
    var price = document.createElement("span");
    price.innerText = product.price/100 * product.qty + " " + "kr"

    /* Qty */
    let qty = document.createElement('span')
    qty.innerText = `Antal: ${product.qty}`

    /* Button */
    var button = document.createElement("button");
    button.innerHTML = '<i class="fa fa-trash-o" aria-hidden="true"></i>' + "&nbsp;&nbsp;&nbsp;" + "Ta bort";
    button.onclick = function () {
        /* Remove the item from the array */
        shoppingCart = JSON.parse(localStorage.getItem('products'))
        let totalQty = localStorage.getItem('quantity')
        totalQty = parseInt(totalQty)

        let exist = shoppingCart.find(item => item.id == product.id)
        if (exist.qty > 1) {
            exist.qty -= 1
            localStorage.setItem('products', JSON.stringify(shoppingCart))
            
        } else {
            let indexToRemove = shoppingCart.findIndex(item => item.id == product.id)
            shoppingCart.splice(indexToRemove, 1)
            localStorage.setItem('products', JSON.stringify(shoppingCart))
        }

         if (totalQty) {
            counter = document.querySelector("#counter");
            localStorage.setItem('quantity', totalQty - 1)
            counter.innerText = totalQty - 1
        } else {
            localStorage.setItem('quantity', )
            counter = document.querySelector("#counter");
            counter.innerText = totalQty
        }
        
        
        isItemsViewVisible = true;
        showShoppingCart();

        /* Update the counter */
        /* counter = document.querySelector("#counter");
        counter.innerText = totalQty */
        /* Update the UI list */
    };

    var item = document.createElement("li");
    item.appendChild(image);
    item.appendChild(title);
    item.appendChild(price);
    item.appendChild(qty)
    item.appendChild(button);

    return item;
}

function createShoppingSummary() {
    /* Total price */
    shoppingCart = JSON.parse(localStorage.getItem('products'))

    var totalPrice = 0;
    for (var i = 0; i < shoppingCart.length; i++) {
        totalPrice += shoppingCart[i].price * shoppingCart[i].qty /100;
    }
    var priceLabel = document.createElement("h2");
    priceLabel.innerText = "Totalt pris: " + totalPrice + " kr";

    /* Proceed button */
    var proceedButton = document.createElement("button");
    proceedButton.innerHTML = '<i class="fa fa-check" aria-hidden="true"></i>' + "&nbsp;&nbsp;&nbsp;" + "Slutför ditt köp";
    proceedButton.onclick = function () {
        console.log(shoppingCart);
        
    };

    proceedButton.addEventListener("click", () => {
        console.log(shoppingCart);
        
        fetch("http://localhost:3000/checkout", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            shoppingCart,
        }),
        })
        .then(async res => {
            if (res.ok) return res.json()
            const json = await res.json();
            return await Promise.reject(json);
        })
        .then(({ url }) => {
            window.location = url
            
        })
        .catch(e => {
            console.error(e.error)
        })
    })

  
    var info = document.createElement("div");
    info.appendChild(priceLabel);
    info.appendChild(proceedButton);

    return info;
}
setTimeout(() => {
              
    if(window.location.href === "http://localhost:3000/cancel.html"){
      window.location.href = "http://localhost:3000/"
      console.log('url')
      }
},1500);