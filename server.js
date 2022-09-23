import express from "express";
import dotenv from "dotenv";
dotenv.config();
import Stripe from "stripe";
import cookieSession from "cookie-session";
import { router as stripeRouter } from "./routers/stripe.js";
import { orderArr } from "./routers/stripe.js";
import { router as userRouter } from "./routers/user.js";

export const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY);

const port = 3000;

const app = express();

app.use(express.json());
app.use("/stripe", stripeRouter);
app.use("/user", userRouter);
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

//Gets all products from Stripe
app.get("/products", async (req, res) => {
  const products = await stripe.products.list({
    expand: ["data.default_price"],
  });

  res.json(products);
});

//Gets all orders for one Customer
app.get("/my-orders/:id", (req, res) => {
  if (!req.session.signedInUser) {
    res.status(401);
  }

  let userId = req.params.id;
  const myOrder = orderArr.filter((order) => order.customer_id.id == userId);
  if (myOrder) {
    res.json(myOrder);
  }
});

app.listen(port, () => {
  console.log("Server is running on port " + port);
});
