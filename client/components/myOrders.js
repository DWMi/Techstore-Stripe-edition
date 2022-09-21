const main = document.querySelector("#main"),
titleHeader = document.querySelector("#titleHeader"),
orderTitle = document.createElement("h2"),
orderSubTitle = document.createElement("h1"),
container = document.createElement("div")

orderTitle.innerText = "My Orders"

container.classList.add('container')




const init = async () => {
  let user = await checkLogIn();
  let order = await orderFetch(user);
  await renderOrders(order);
};

async function checkLogIn() {
  let url = "http://localhost:3000/checkLogin";
  let method = "GET";
  let result = await makeRequest(url, method, undefined);
  return result;
}

const orderFetch = async (user) => {
  try {
    let response = await fetch(`http://localhost:3000/my-orders/${user.id}`);
    let result = await response.json();
    return result;
  } catch (err) {
    console.error(err);
  }
};

async function renderOrders(order) {
  console.log(order);
  main.append(container);
  container.append(orderTitle, orderSubTitle);

  if (order.length === 0) {
    orderSubTitle.innerText = 'You did not order anything from us yet.'
    const goBackHome = document.createElement('button')
    goBackHome.innerText = 'Shop now'
    goBackHome.addEventListener('click', () => {
      window.location.href = '/'
    })
    container.append(goBackHome)
  }else{
   

    order.forEach((element) => {
      myOrders(element);
    });
  }
}

export async function makeRequest(url, method, body) {
  try {
    let response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body,
    });
    let result = await response.json();
    return result;
  } catch (err) {
    console.error(err);
  }
}

function myOrders(element) {
  const orderContainer = document.createElement("div");
  orderContainer.classList.add("orderContainer");

  const orderContainerHeader = document.createElement("div");
  orderContainerHeader.classList.add("orderContainerHeader");

  const orderNumber = document.createElement("h4");
  orderNumber.classList.add("orderNumber");
  orderNumber.innerText = "Order: #" + element.orderNumber;

  const orderDate = document.createElement("h4");
  orderDate.classList.add("orderDate");
  orderDate.innerText = "Placed on: " + element.date;

  /* Footer */

  const orderContainerFooter = document.createElement('div')
  orderContainerFooter.classList.add('orderContainerFooter')

  // ship to
  const shippingDetails = document.createElement('div')
  shippingDetails.classList.add('shippingDetails')

  const addressText = document.createElement('h4')
  addressText.innerText = 'Ship to:'

  const shippingName = document.createElement('p')
  shippingName.innerText = element.name

  const shippingAddress = document.createElement('p')
  shippingAddress.innerText = element.address.line1

  const shippingCity = document.createElement('p')
  shippingCity.innerText = element.address.city

  const shippingZip = document.createElement('p')
  shippingZip.innerText = element.address.zip

  /* Total amount */

  const totalAmountContainer = document.createElement('div')
  totalAmountContainer.classList.add('totalAmountContainer')
  const totalAmount = document.createElement('p')
  totalAmount.innerText = 'Total: ' + element.total_amount/100 + ',00 SEK'

  totalAmountContainer.append(totalAmount)

  shippingDetails.append(addressText, shippingName, shippingAddress, shippingCity, shippingZip)
  orderContainerFooter.append(shippingDetails, totalAmountContainer)
  orderContainerHeader.append(orderNumber, orderDate);
  orderContainer.append(orderContainerHeader)
  
  element.products.forEach((product) => {
    // create the container for each product ordered
    const orderProductContainer = document.createElement("div");
    orderProductContainer.classList.add("orderProductContainer");
    // create the container for the single product
    const singleProduct = document.createElement('span')
    singleProduct.classList.add('singleProduct')
    // create the img tag for the single product
    const productImg = document.createElement('img')
    productImg.classList.add('productImg')
    productImg.src = product.price.product.images[0]
    // create the p tag with description for the single product
    const productDescription = document.createElement('h4')
    productDescription.classList.add('productDescription')
    productDescription.innerText = product.description
    // create the p tag for the quantity of the single product
    const productQuantity = document.createElement('p')
    productQuantity.classList.add('productQuantity')
    productQuantity.innerText = 'Qty: ' + product.quantity
    // create the p tag for the price of the single product
    const productPrice = document.createElement('p')
    productPrice.classList.add('productPrice')
    productPrice.innerText = 'Price: ' + product.price.unit_amount/100 + ',00 SEK'
    singleProduct.append(productImg, productDescription)
    orderProductContainer.append(singleProduct, productQuantity, productPrice)
    orderContainer.append(orderProductContainer)
  });
  container.append(orderContainer);
  orderContainer.append(orderContainerFooter)

}

window.addEventListener("load", init);

titleHeader.addEventListener("click", () => {
  window.location.href = "http://localhost:3000";
});
