import { checkLogIn } from "./commonFunctions.js";

const main = document.querySelector("#main"),
  titleHeader = document.querySelector("#titleHeader"),
  orderTitle = document.createElement("h2"),
  orderSubTitle = document.createElement("h1"),
  container = document.createElement("div");
container.classList.add("container");

orderTitle.innerText = "My Orders";

titleHeader.addEventListener("click", () => {
  window.location.href = "http://localhost:3000";
});

const init = async () => {
  let user = await checkLogIn();
  let order = await orderFetch(user);
  await renderOrders(order);
};

const orderFetch = async (user) => {
  try {
    let response = await fetch(`http://localhost:3000/my-orders/${user.id}`);
    if (response.status === 401) {
      orderTitle.innerText = "401 unauthorized";
      orderSubTitle.innerText = "";
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    } else {
      let result = await response.json();

      return result;
    }
  } catch (err) {
    console.error(err);
  }
};

async function renderOrders(order) {
  main.append(container);
  container.append(orderTitle, orderSubTitle);

  if (order.length === 0) {
    orderSubTitle.innerText = "You did not order anything from us yet.";
    const goBackHome = document.createElement("button");
    goBackHome.innerText = "Shop now";
    goBackHome.addEventListener("click", () => {
      window.location.href = "/";
    });
    container.append(goBackHome);
  } else {
    order.forEach((element) => {
      myOrders(element);
    });
  }
}

function myOrders(element) {
  /* order container */
  const orderContainer = document.createElement("div");
  orderContainer.classList.add("orderContainer");

  /* order header */
  const orderContainerHeader = document.createElement("div");
  orderContainerHeader.classList.add("orderContainerHeader");

  const orderNumber = document.createElement("h4");
  orderNumber.classList.add("orderNumber");
  orderNumber.innerText = "Order: #" + element.orderNumber;

  const orderDate = document.createElement("h4");
  orderDate.classList.add("orderDate");
  orderDate.innerText = "Placed on: " + element.date;

  /* Footer */

  const orderContainerFooter = document.createElement("div");
  orderContainerFooter.classList.add("orderContainerFooter");

  //  billing address
  const billingDetails = document.createElement("div");
  billingDetails.classList.add("billingDetails");

  const billTo = document.createElement("h4");
  billTo.innerText = "Billing details:";

  const billingName = document.createElement("p");
  billingName.innerText = element.customer_id.name;

  const billingAddress = document.createElement("p");
  billingAddress.innerText = element.billing_address.line1;

  const billingCity = document.createElement("p");
  billingCity.innerText = element.billing_address.city;

  const billingZip = document.createElement("p");
  billingZip.innerText = element.billing_address.postal_code;

  // ship to
  const shippingDetails = document.createElement("div");
  shippingDetails.classList.add("shippingDetails");

  const addressText = document.createElement("h4");
  addressText.innerText = "Shipping details:";

  const shippingName = document.createElement("p");
  shippingName.innerText = element.name;

  const shippingAddress = document.createElement("p");
  shippingAddress.innerText = element.shipping_address.line1;

  const shippingCity = document.createElement("p");
  shippingCity.innerText = element.shipping_address.city;

  const shippingZip = document.createElement("p");
  shippingZip.innerText = element.shipping_address.zip;

  /* Total amount */

  const totalAmountContainer = document.createElement("div");
  totalAmountContainer.classList.add("totalAmountContainer");
  const totalAmount = document.createElement("p");
  totalAmount.innerText = "Total: " + element.total_amount / 100 + ",00 SEK";

  totalAmountContainer.append(totalAmount);

  billingDetails.append(
    billTo,
    billingName,
    billingAddress,
    billingCity,
    billingZip
  );
  shippingDetails.append(
    addressText,
    shippingName,
    shippingAddress,
    shippingCity,
    shippingZip
  );
  orderContainerFooter.append(
    billingDetails,
    shippingDetails,
    totalAmountContainer
  );
  orderContainerHeader.append(orderNumber, orderDate);
  orderContainer.append(orderContainerHeader);

  element.products.forEach((product) => {
    // create the container for each product ordered
    const orderProductContainer = document.createElement("div");
    orderProductContainer.classList.add("orderProductContainer");
    // create the container for the single product
    const singleProduct = document.createElement("span");
    singleProduct.classList.add("singleProduct");
    // create the img tag for the single product
    const productImg = document.createElement("img");
    productImg.classList.add("productImg");
    productImg.src = product.price.product.images[0];
    // create the p tag with description for the single product
    const productDescription = document.createElement("h4");
    productDescription.classList.add("productDescription");
    productDescription.innerText = product.description;
    // create the p tag for the quantity of the single product
    const productQuantity = document.createElement("p");
    productQuantity.classList.add("productQuantity");
    productQuantity.innerText = "Qty: " + product.quantity;
    // create the p tag for the price of the single product
    const productPrice = document.createElement("p");
    productPrice.classList.add("productPrice");
    productPrice.innerText =
      "Price: " + product.price.unit_amount / 100 + ",00 SEK";
    singleProduct.append(productImg, productDescription);
    orderProductContainer.append(singleProduct, productQuantity, productPrice);
    orderContainer.append(orderProductContainer);
  });

  container.append(orderContainer);
  orderContainer.append(orderContainerFooter);
}

window.addEventListener("load", init);
