import { loggedInUser } from "./signUpIn.js";
import { removeFromCart } from "../localStorageFunctions.js";

export function showShoppingCart(isItemsViewVisible, shoppingCart) {
  if (!isItemsViewVisible) {
    return;
  }
  isItemsViewVisible = false;

  /* Header */
  var header = document.createElement("h2");
  header.innerHTML =
    '<i class="fa fa-shopping-cart" aria-hidden="true"></i>' + " Cart";

  /* Shopping list */
  var list = document.createElement("ul");

  shoppingCart = JSON.parse(localStorage.getItem("products"));
  if (shoppingCart) {
    shoppingCart.forEach((product) => {
      list.appendChild(
        createShoppingCartItem(product, isItemsViewVisible, shoppingCart)
      );
    });
  }

  /* Shopping info & action */
  var info = createShoppingSummary(shoppingCart);

  var content = document.createElement("div");
  content.appendChild(header);
  content.appendChild(list);
  content.appendChild(info);

  var container = document.querySelector("#main");
  container.replaceChild(content, container.firstChild);
}

function createShoppingCartItem(product, isItemsViewVisible, shoppingCart) {
  /* Image */
  var image = document.createElement("img");
  image.src = product.images[0];

  /* Title */
  var title = document.createElement("h3");
  title.innerText = product.name;

  /* Price */
  var price = document.createElement("span");
  price.innerText = (product.price / 100) * product.qty + ",00 SEK";

  /* Qty */
  let qty = document.createElement("span");
  qty.innerText = `Quantity: ${product.qty}`;

  /* Button */
  var button = document.createElement("button");
  button.innerHTML =
    '<i class="fa fa-trash-o" aria-hidden="true"></i>' +
    "&nbsp;&nbsp;&nbsp;" +
    "Remove";
  button.onclick = function () {
    /* Remove the item from the array */
    shoppingCart = JSON.parse(localStorage.getItem("products"));
    let totalQty = localStorage.getItem("quantity");
    totalQty = parseInt(totalQty);
    let exist = shoppingCart.find((item) => item.id == product.id);

    removeFromCart(product, exist, shoppingCart, totalQty, counter);

    isItemsViewVisible = true;
    showShoppingCart(isItemsViewVisible, shoppingCart);
  };

  var item = document.createElement("li");
  item.appendChild(image);
  item.appendChild(title);
  item.appendChild(price);
  item.appendChild(qty);
  item.appendChild(button);

  return item;
}

function createShoppingSummary(shoppingCart) {
  /* Total price */
  shoppingCart = JSON.parse(localStorage.getItem("products"));

  var totalPrice = 0;
  for (var i = 0; i < shoppingCart.length; i++) {
    totalPrice += (shoppingCart[i].price * shoppingCart[i].qty) / 100;
  }

  if (shoppingCart.length == 0) {
    var priceLabel = document.createElement("h2");
    priceLabel.innerText = "Your cart is empty!";
  } else {
    var priceLabel = document.createElement("h2");
    priceLabel.innerText = "Total price: " + totalPrice + ",00 SEK";
  }

  /* Proceed button */
  var proceedButton = document.createElement("button");
  proceedButton.innerHTML =
    "Proceed to checkout" +
    "&nbsp;&nbsp;&nbsp;" +
    '<i class="fa fa-check" aria-hidden="true"></i>';
  proceedButton.addEventListener("click", () => {
    goToCheckOut(shoppingCart);
  });

  if (shoppingCart.length == 0) {
    proceedButton.style.display = "none";
  }

  if (loggedInUser.loggedIn == false) {
    proceedButton.disabled = true;
    proceedButton.style.opacity = "50%";
    proceedButton.style.cursor = "not-allowed";
    proceedButton.innerText = "Login to proceed to checkout";
  }

  var info = document.createElement("div");
  info.appendChild(priceLabel);
  info.appendChild(proceedButton);

  return info;
}

function goToCheckOut(shoppingCart) {
  fetch("http://localhost:3000/stripe/checkout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      shoppingCart,
    }),
  })
    .then(async (res) => {
      if (res.ok) return res.json();
      const json = await res.json();
      return await Promise.reject(json);
    })
    .then(({ url }) => {
      window.location = url;
    })
    .catch((e) => {
      console.error(e.error);
    });
}
