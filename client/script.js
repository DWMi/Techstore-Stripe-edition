var itemsData;
let priceArr;
var shoppingCart = [];
var isItemsViewVisible = false;

/* Fetch data from the json file into a javascript object */
fetch("http://localhost:3000/products")
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        itemsData = data;
        console.log(itemsData)
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
            console.log(priceArr)
            createUIFromLoadedItemsData();
        });
}

/* Use the data to create a list of these object on your website */
function createUIFromLoadedItemsData() {
    if (isItemsViewVisible) { return; }
    isItemsViewVisible = true;
    
    /* Create a list of the products */
    var list = document.createElement("ul");

   
    itemsData.data.forEach(product => {
        let priceObj = priceArr.find(price => price.id == product.default_price)
        console.log(priceObj)
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
    if(priceObj) {
        var price = document.createElement("span");
        price.innerText = `${priceString.substring(0, priceString.length - 2)} kr`
    }

    /* Button */
    var button = document.createElement("button");
    button.innerHTML = '<i class="fa fa-cart-arrow-down" aria-hidden="true"></i>' + "&nbsp;&nbsp;&nbsp;" + "Lägg till i kundvagnen";
    button.onclick = function() {
        shoppingCart.push(product);
        counter = document.querySelector("#counter");
        counter.innerText = shoppingCart.length;
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
    for(var index = 0; index < shoppingCart.length; index++) {
        list.appendChild(createShoppingCartItem(shoppingCart[index], index));
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

function createShoppingCartItem(itemData, index) {
    /* Image */
    var image = document.createElement("img");
    image.src = "./assets/" + itemData.image;

    /* Title */
    var title = document.createElement("h3");
    title.innerText = itemData.title;

    /* Price */
    var price = document.createElement("span");
    price.innerText = "" + itemData.price + " kr";
    
    /* Button */
    var button = document.createElement("button");
    button.innerHTML = '<i class="fa fa-trash-o" aria-hidden="true"></i>' + "&nbsp;&nbsp;&nbsp;" + "Ta bort";
    button.onclick = function() {
        /* Remove the item from the array */
        shoppingCart.splice(index, 1);
        /* Update the counter */
        counter = document.querySelector("#counter");
        counter.innerText = shoppingCart.length;
        /* Update the UI list */
        isItemsViewVisible = true;
        showShoppingCart();
    };

    var item = document.createElement("li");
    item.appendChild(image);
    item.appendChild(title);
    item.appendChild(price);
    item.appendChild(button);

    return item;
}

function createShoppingSummary() {
    /* Total price */
    var totalPrice = 0;
    for(var i = 0; i < shoppingCart.length; i++) {
        totalPrice += shoppingCart[i].price;
    }
    var priceLabel = document.createElement("h2");
    priceLabel.innerText = "Totalt pris: " + totalPrice + " kr";
    
    /* Proceed button */
    var proceedButton = document.createElement("button");
    proceedButton.innerHTML = '<i class="fa fa-check" aria-hidden="true"></i>' + "&nbsp;&nbsp;&nbsp;" + "Slutför ditt köp";
    proceedButton.onclick = function() {
        alert("Tack för din beställning, vi önskar dig en fin kväll! Ses snart igen =)");
    };

    var info = document.createElement("div");
    info.appendChild(priceLabel);
    info.appendChild(proceedButton);

    return info;
}