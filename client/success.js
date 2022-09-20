let params = new URLSearchParams(window.location.search);
let id = params.get("session_id");

const init = async () => {
  try {
    let savedSessionStatus = await saveOrder();
    console.log(savedSessionStatus);
    let savedOrder = await getOrder();
    console.log(savedOrder);
    /* appendOrder(savedOrder); */
  } catch (err) {
    console.log("CRASH");
  }
};

let saveOrder = async () => {
  try {
    let response = await fetch(
      "http://localhost:3000/checkout/session?id=" + id
    );
    return await response.json();
  } catch (err) {
    if (err.status == 408) {
      throw err;
    } else if (err.status == 405) {
      console.log(err.message);
    }
  }
};

let getOrder = async () => {

    let response = await fetch("http://localhost:3000/get-order?id=" + id);
    return await response.json();

    /* if (err.status == 408) {
      throw err;
    } else if (err.status == 405) {
      console.log(err.message);
    
  } */
};

function appendOrder(order) {
  const orderContainer = document.getElementById("orderContainer");
  const orderDetails = document.getElementById("orderDetails");

  const thankYou = document.getElementById("confirmed");
  thankYou.innerHTML = "Thank you for your order!";
  const summary = document.createElement("h4");
  summary.classList.add("summary");
  summary.innerHTML = "Here is your order details:";
  orderContainer.append(summary);

  order.products.forEach((element) => {
    const itemContainer = document.createElement("div");
    itemContainer.classList.add("itemContainer");
    const item = document.createElement("h4");
    item.innerHTML = element.description;
    const itemPicture = document.createElement("img");
    itemPicture.src = element.price.product.images[0];
    const singlePrice = document.createElement("p");
    singlePrice.innerHTML = "Price: " + element.price.unit_amount / 100 + "kr";
    const quantity = document.createElement("p");
    quantity.innerHTML = "Quantity: " + element.quantity;
    itemContainer.append(item, itemPicture, singlePrice, quantity);
    orderDetails.append(itemContainer);
    orderContainer.append(orderDetails);
  });

  const totalPrice = document.createElement("h4");
  totalPrice.innerHTML = "Total Price: " + order.total_amount / 100 + "kr";
  const backHomeBtn = document.createElement("button");
  backHomeBtn.innerHTML = "Back to the homepage";

  orderContainer.append(totalPrice, backHomeBtn);

  backHomeBtn.addEventListener("click", () => {
    location.replace("http://localhost:3000");
    localStorage.clear();
  });
}

window.addEventListener("load", init);
