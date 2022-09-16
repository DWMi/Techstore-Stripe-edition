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
    maxAge: 1000 * 100000,
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

app.get("/checkLogin", (req, res) => {
  if (req.session && req.session.signedInUser) {
    const user = {
      id: req.session.signedInUser.user.id,
      email: req.session.signedInUser.user.email,
      name: req.session.signedInUser.user.username,
      loggedIn: true
    }
    res.json(user);
    return;
  }
  res.json({loggedIn: false});
});

app.post("/login", async (req, res) => {
  if (req.body.email && req.body.password) {
    const foundUser = userArr.find((user) => user.email == req.body.email);
    if(!foundUser) {
      res.status(401).json("Incorrect email or password..");
      return;
    }
    const auth = await bcrypt.compare(req.body.password, foundUser.password)
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

  res.status(401).json("Incorrect password");
  return
});

app.delete("/logout", (req, res) => {
  if (req.session) {
  
    req.session = null;
    res.json('logged out')
  }
});

app.post("/register", async (req, res) => {
  let userExist = userArr.find(user => user.email == req.body.email)
  if(userExist) {
    res.json("This user already exists! Choose another username..");
    return;
  }

  if (req.body && req.body.username && req.body.password && req.body.email && req.body.address && req.body.city && req.body.zip) {
    const hashedPW = await bcrypt.hash(req.body.password, 10);

    let user = {
      id: nanoid(),
      username: req.body.username,
      email: req.body.email,
      password: hashedPW
    };

    userArr.push(user);
    users = JSON.stringify(userArr);
    fs.writeFile("users.json", users, (err) => {  
      if (err) throw err;
      res.json("New user is added");
    });

    const customer = await stripe.customers.create({
      name: user.username,
      email: user.email,
      address: {
        line1: req.body.address,
        city: req.body.city,
        postal_code: req.body.zip
      }

      
    });
    
    res.json(customer + "New user has ben signed up");
    return;
  }

  res.json("Incorrect info");
});

app.get('/test', (req, res) => {
  res.json(userArr)
})

app.post("/checkout", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      shipping_address_collection: {
        allowed_countries: ['SE', 'US'],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: 0,
              currency: 'sek',
            },
            display_name: 'Free shipping',
            // Delivers between 5-7 business days
            delivery_estimate: {
              minimum: {
                unit: 'business_day',
                value: 5,
              },
              maximum: {
                unit: 'business_day',
                value: 7,
              },
            }
          }
        },
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: 1500,
              currency: 'sek',
            },
            display_name: 'Next day air',
            // Delivers in exactly 1 business day
            delivery_estimate: {
              minimum: {
                unit: 'business_day',
                value: 1,
              },
              maximum: {
                unit: 'business_day',
                value: 1,
              },
            }
          }
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
