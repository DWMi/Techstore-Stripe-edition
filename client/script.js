import { addToCart} from "./localStorageFunctions.js";
import { makeRequest} from './components-js/commonFunctions.js'
import { showShoppingCart } from './components-js/shoppingCart.js'

document.getElementById('shoppingCart').addEventListener('click', () => {
    showShoppingCart(isItemsViewVisible, shoppingCart)
})
document.getElementById('titleHeader').addEventListener('click', () => {
    location.reload()
})

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
    let url = "http://localhost:3000/products"
    let method = "GET"
    let result = await makeRequest(url, method, undefined)
    itemsData = result
    createUIFromLoadedItemsData()
    let totalQty = localStorage.getItem('quantity')
    counter.innerText = totalQty
}


/* Use the data to create a list of these object on your website */
function createUIFromLoadedItemsData() {
    if (isItemsViewVisible) { 
        return;
    }
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
    price.innerText = `${product.default_price.unit_amount / 100},00 SEK`

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


fetchProducts()


