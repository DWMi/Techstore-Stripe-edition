import { addToCart, removeFromCart } from "./localStorageFunctions.js";
import { loggedInUser } from "./components/signUpIn.js";
document.getElementById('shoppingCart').addEventListener('click', showShoppingCart)
document.getElementById('titleHeader').addEventListener('click', createUIFromLoadedItemsData)
let counter = document.querySelector("#counter");

let itemsData;
let shoppingCart;
let isItemsViewVisible = false;

if (localStorage.getItem('products')) {
    shoppingCart = JSON.parse(localStorage.getItem('products'))
} else {
    shoppingCart = [];
    JSON.stringify(localStorage.setItem('products', '[]'))
}

/* Fetch data from the json file into a javascript object */
const fetchProducts = async () => {

   await fetch("http://localhost:3000/products")
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            itemsData = data;
            console.log(itemsData)
            createUIFromLoadedItemsData();
            let totalQty = localStorage.getItem('quantity')
            counter.innerText = totalQty
        });
}


/* Use the data to create a list of these object on your website */
function createUIFromLoadedItemsData() {
    if (isItemsViewVisible) { return; }
    isItemsViewVisible = true;

    /* Create a list of the products */
    var list = document.createElement("ul");

    itemsData.data.forEach(product => {
        list.appendChild(createListItem(product))
    });


    /* Add the list to the DOM */
    var container = document.querySelector("#main");
    if (container.firstChild) {
        container.replaceChild(list, container.firstChild);
    } else {
        container.appendChild(list);
    }
}

function createListItem(product) {

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
    var price = document.createElement("span");
    price.innerText = `${product.default_price.unit_amount / 100} kr`

    /* Button */
    var button = document.createElement("button");
    button.innerHTML = '<i class="fa fa-cart-arrow-down" aria-hidden="true"></i>' + "&nbsp;&nbsp;&nbsp;" + "Add to cart";

    button.onclick = function () {
        localStorage.setItem('products', JSON.stringify(shoppingCart))
        let totalQty = localStorage.getItem('quantity')
        totalQty = parseInt(totalQty)
        let exist = shoppingCart.find(item => item.id == product.id)

        addToCart(product, exist, shoppingCart, totalQty, counter)
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
    header.innerHTML = '<i class="fa fa-shopping-cart" aria-hidden="true"></i>' + " Cart";

    /* Shopping list */
    var list = document.createElement("ul");

    shoppingCart = JSON.parse(localStorage.getItem('products'))
    if (shoppingCart) {
        shoppingCart.forEach(product => {
            list.appendChild(createShoppingCartItem(product));
        });
    }

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
    price.innerText = product.price / 100 * product.qty + " " + "kr"

    /* Qty */
    let qty = document.createElement('span')
    qty.innerText = `Quantity: ${product.qty}`

    /* Button */
    var button = document.createElement("button");
    button.innerHTML = '<i class="fa fa-trash-o" aria-hidden="true"></i>' + "&nbsp;&nbsp;&nbsp;" + "Remove";
    button.onclick = function () {
        /* Remove the item from the array */
        shoppingCart = JSON.parse(localStorage.getItem('products'))
        let totalQty = localStorage.getItem('quantity')
        totalQty = parseInt(totalQty)
        let exist = shoppingCart.find(item => item.id == product.id)

        removeFromCart(product, exist, shoppingCart, totalQty, counter)

        isItemsViewVisible = true;
        showShoppingCart();
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
        totalPrice += shoppingCart[i].price * shoppingCart[i].qty / 100;
    }

    if(shoppingCart.length == 0) {
        var priceLabel = document.createElement("h2");
        priceLabel.innerText = 'Your cart is empty!';
    } else {
        var priceLabel = document.createElement("h2");
        priceLabel.innerText = "Total price: " + totalPrice + " kr";
    }

    /* Proceed button */
    var proceedButton = document.createElement("button");
    proceedButton.innerHTML = "Proceed to checkout" + "&nbsp;&nbsp;&nbsp;" + '<i class="fa fa-check" aria-hidden="true"></i>';
    proceedButton.onclick = function () {
        console.log(shoppingCart);

    };

    if( shoppingCart.length == 0 ) {
        proceedButton.style.display = 'none'
    }

    if(loggedInUser.loggedIn == false) {
        proceedButton.disabled = true
        proceedButton.style.opacity = '50%'
        proceedButton.style.cursor = 'not-allowed'
        proceedButton.innerText = 'Login to proceed to checkout'
    }

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
                console.log(url)

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
fetchProducts()

    if (window.location.href === "http://localhost:3000/cancel.html") {
        setTimeout(() => {
             window.location.href = "http://localhost:3000/"
             
    }, 2500);
    }
