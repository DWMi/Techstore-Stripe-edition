//Add to localStorage cart
export function addToCart(product, exist, shoppingCart, totalQty, counter) {
  if (exist) {
    exist.qty += 1;
    localStorage.setItem("products", JSON.stringify(shoppingCart));
  } else {
    shoppingCart.push({
      ...product,
      qty: 1,
      price: product.default_price.unit_amount,
    });
    localStorage.setItem("products", JSON.stringify(shoppingCart));
  }

  //add to totalQty in cart
  if (totalQty) {
    counter = document.querySelector("#counter");
    localStorage.setItem("quantity", totalQty + 1);
    counter.innerText = totalQty + 1;
  } else {
    localStorage.setItem("quantity", 1);
    counter = document.querySelector("#counter");
    counter.innerText = 1;
  }
}

// REMOVE FROM LOCALSTORAGE

export function removeFromCart(
  product,
  exist,
  shoppingCart,
  totalQty,
  counter
) {
  if (exist.qty > 1) {
    exist.qty -= 1;
    localStorage.setItem("products", JSON.stringify(shoppingCart));
  } else {
    let indexToRemove = shoppingCart.findIndex((item) => item.id == product.id);
    shoppingCart.splice(indexToRemove, 1);
    localStorage.setItem("products", JSON.stringify(shoppingCart));
  }

  if (totalQty) {
    counter = document.querySelector("#counter");
    localStorage.setItem("quantity", totalQty - 1);
    counter.innerText = totalQty - 1;
  } else {
    localStorage.setItem("quantity");
    counter = document.querySelector("#counter");
    counter.innerText = totalQty;
  }
}
