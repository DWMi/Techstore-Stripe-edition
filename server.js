import express from "express";
import dotenv from "dotenv";
dotenv.config();
import Stripe from "stripe";
import { customAlphabet } from "nanoid";
import cookieSession from "cookie-session";
import bcrypt from "bcrypt";
import * as fs from "fs";

const nanoid = customAlphabet('1234567890', 10)

let users = [];
let userData = fs.readFileSync("users.json");
let userArr = JSON.parse(userData);

let orders = [];
let orderData = fs.readFileSync("orders.json");
let orderArr = JSON.parse(orderData);

const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY);

const port = 3000;

const app = express();

app.use(express.json());
app.use("/", express.static("./client"));
app.use(
  cookieSession({
    secret: "aVeryS3cr3tK3y",
    maxAge: 1000 * 100000,
    sameSite: "strict",
    httpOnly: true,
    secure: false,
  })
);

app.get("/products", async (req, res) => {
  const products = await stripe.products.list({
    expand: ["data.default_price"],
  });

  res.json(products);
});

app.get("/users", (req, res) => {
  res.json(users);
});

app.get("/checkLogin", (req, res) => {
  if (req.session && req.session.signedInUser) {
    const user = {
      id: req.session.signedInUser.user.id,
      email: req.session.signedInUser.user.email,
      name: req.session.signedInUser.user.username,
      loggedIn: true,
    };
    res.json(user);
    return;
  }
  res.json({ loggedIn: false });
});

app.post("/login", async (req, res) => {
  if (req.body.email && req.body.password) {
    const foundUser = userArr.find((user) => user.email == req.body.email);
    if (!foundUser) {
      res.status(401).json("Incorrect email or password..");
      return;
    }
    const auth = await bcrypt.compare(req.body.password, foundUser.password);
    if (foundUser && auth) {
      req.session.signedInUser = {
        id: nanoid(),
        user: foundUser,
        date: new Date(),
      };
      console.log(req.session);
      res.status(200).json("Successful signed in!");
      return;
    }
  }

  res.status(401).json("Incorrect email or password..");
  return;
});

app.delete("/logout", (req, res) => {
  if (req.session) {
    req.session = null;
    res.json("logged out");
  }
});

app.post("/register", async (req, res) => {
  let userExist = userArr.find((user) => user.email == req.body.email);
  if (userExist) {
    res.status(401).json("Email is invalid or already exists!");
    return;
  }

  if (
    req.body &&
    req.body.username &&
    req.body.password &&
    req.body.email &&
    req.body.address &&
    req.body.city &&
    req.body.zip
  ) {
    const hashedPW = await bcrypt.hash(req.body.password, 10);

    const customer = await stripe.customers.create({
      name: req.body.username,
      email: req.body.email,
      address: {
        line1: req.body.address,
        city: req.body.city,
        postal_code: req.body.zip,
      },
    });

    let user = {
      id: customer.id,
      username: req.body.username,
      email: req.body.email,
      password: hashedPW,
    };

    userArr.push(user);
    users = JSON.stringify(userArr);
    fs.writeFile("users.json", users, (err) => {
      if (err) throw err;
      res.json("New user is added");
    });

    req.session.signedInUser = {
      id: nanoid(),
      user: user,
      date: new Date(),
    };

    res.json("New user has ben signed up");
    return;
  }

  res.json("Incorrect info");
});

app.post("/checkout", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      customer: req.session.signedInUser.user.id,
      payment_method_types: ["card"],
      mode: "payment",
      shipping_address_collection: {
        allowed_countries: ["SE", "US"],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: 0,
              currency: "sek",
            },
            display_name: "Free shipping",
            // Delivers between 5-7 business days
            delivery_estimate: {
              minimum: {
                unit: "business_day",
                value: 5,
              },
              maximum: {
                unit: "business_day",
                value: 7,
              },
            },
          },
        },
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: 1500,
              currency: "sek",
            },
            display_name: "Next day air",
            // Delivers in exactly 1 business day
            delivery_estimate: {
              minimum: {
                unit: "business_day",
                value: 1,
              },
              maximum: {
                unit: "business_day",
                value: 1,
              },
            },
          },
        },
      ],
      line_items: req.body.shoppingCart.map((data) => {
        return {
          price_data: {
            currency: "sek",
            unit_amount: data.price,
            product_data: {
              name: data.name,
              images: data.images,
            },
          },
          quantity: data.qty,
        };
      }),
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/success.html?session_id={CHECKOUT_SESSION_ID}`, //add order
      cancel_url: `${process.env.CLIENT_URL}/cancel.html`,
    });
    res.json({ url: session.url });
  } catch (e) {
    res.status(500).json({ error: e.message });
    
  }
});

app.get("/checkout/session", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(req.query.id, {
      expand: ["line_items.data.price.product"],
    });

 let paid = session.payment_status == "paid"; 

    if (!paid) {
      res.status(400);
      throw new Error("Payment failed");
    }


    let orderTest = {
      orderNumber: nanoid(),
      date: new Date().toISOString().split('T')[0],
      orderId: session.id,
      customer_id: session.customer,
      name: session.shipping_details.name,
      email: session.customer_details.email,
      address: {
        city: session.shipping_details.address.city,
        line1: session.shipping_details.address.line1,
        zip: session.shipping_details.address.postal_code,
      },
      total_amount: session.amount_total,
      products: session.line_items.data,
    };

    const foundOrder = orderArr.find(
      (order) => order.orderId == session.id
    );

    if (!foundOrder) {
      orderArr.push(orderTest);
      orders = JSON.stringify(orderArr);
      fs.writeFile("orders.json", orders, (err) => {
        if (err) throw err;
      });
      return res.json("Order saved!");
    } else {
      res.json("Order already placed!");
    }
  } catch (err) {
    res.status(400).json("http://localhost:3000/cancel.html");
   
  }
});

app.get("/get-order", async (req, res) => {
  const session = await stripe.checkout.sessions.retrieve(req.query.id, {
    expand: ["line_items.data.price.product"]
  });

  const foundOrder = orderArr.find((order) => order.orderId == session.id);

  if (foundOrder) {
     res.json(foundOrder);
  } 
    res.status(500);
  
});

app.get("/my-orders/:id", (req, res)=>{
  let userId = req.params.id
  const myOrder = orderArr.filter((order) => order.customer_id == userId)
  if(myOrder){
    res.json(myOrder)
  }

})
app.listen(port, () => {
  console.log("Server is running on port " + port);
});
