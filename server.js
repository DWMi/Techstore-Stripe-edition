import express from "express";
import dotenv from "dotenv";
dotenv.config();
import fetch from "node-fetch";
import Stripe from "stripe";
import { nanoid } from "nanoid";
import cookieSession from "cookie-session";
import bcrypt from "bcrypt";
import * as fs from "fs"

let users = []
let userData = fs.readFileSync('users.json')
let userArr = JSON.parse(userData)

const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY);

const port = 3000;

const app = express();

app.use(express.json());
app.use("/", express.static("./client"));
app.use(
  cookieSession({
    secret: "aVeryS3cr3tK3y",
    maxAge: 1000 * 10,
    sameSite: "strict",
    httpOnly: true,
    secure: false,
  })
);

app.get("/products", async (req, res) => {
  const products = await stripe.products.list({});

  res.json(products);
});

app.get("/prices", async (req, res) => {
  const prices = await stripe.prices.list({});

  res.json(prices);
});

app.get("/users", (req, res) => {
  res.json(users);
});

app.get("/login", (req, res) => {
  if (req.session && req.session.signedInUser) {
    res.json(req.session.signedInUser);
    return;
  }
  res.json("Not longer signed in");
});

app.post("/login", async (req, res) => {
  if (req.body.username && req.body.password) {
    const foundUser = users.find((user) => user.username == req.body.username);
    if (foundUser && bcrypt.compare(req.body.password, foundUser.password)) {
      req.session.signedInUser = {
        id: nanoid(),
        user: foundUser,
        date: new Date(),
      };
      res.status(200).json("Successful signed in!");
      return;
    }
    res.status(401).json("Incorrect password!!!");
    return;
  }

  res.status(401).json("Incorrect Username!!!");
});

app.delete("/login", (req, res) => {
  if (req.session.signedInUser) {
    req.session = null;
    res.json("Signed Out");
  }
});

app.post("/register", async (req, res) => {
  if (req.body && req.body.username && req.body.password && req.body.email) {
    const hashedPW = await bcrypt.hash(req.body.password, 10);

    let user = {
      id: nanoid(),
      username: req.body.username,
      email: req.body.email,
      password: hashedPW,
    };

    console.log(userData);
    userArr.push(user);
    users = JSON.stringify(userArr);
    fs.writeFile("users.json", users, (err) => {
      if (err) throw err;
      console.log("New user is added");
    });

    const customer = await stripe.customers.create({
      name: user.username,
      email: user.email,
    });

    res.json("New user has ben signed up");
    return;
  }

  res.json("Incorrect info");
});

app.post("/checkout", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: req.body.shoppingCart.map((data) => {
        const storeItem = res.get(data.name);
        return {
          price_data: {
            currency: "sek",
            unit_amount: data.price,
            product_data: {
              name: data.name,
              images: data.images, //does not show image?
            },
          },
          quantity: data.qty,
        };
      }),
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/success.html?session_id={CHECKOUT_SESSION_ID}",`, //add order
      cancel_url: `${process.env.CLIENT_URL}/cancel.html`,
    });
    res.json({ url: session.url });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/success", async (req, res) => {
  const session = await stripe.checkout.sessions.retrieve(req.query.session_id);
  const customer = await stripe.customers.retrieve(session.customer);

  res.send(
    `<html><body><h1>Thanks for your order, ${customer.name}!</h1></body></html>`
  );
});

app.listen(port, () => {
  console.log("Server is running on port " + port);
});
