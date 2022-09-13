import express from "express";
import dotenv from 'dotenv'
dotenv.config()
import fetch from "node-fetch";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY);

const port = 3000;

const app = express();

app.use(express.json());
app.use("/", express.static("./client"));


app.get('/products', async (req, res) => {
  const products = await stripe.products.list({
  
  });

  res.json(products)

})

app.get('/prices', async (req, res) => {
  const prices = await stripe.prices.list({
    
  });

  res.json(prices)

})





app.listen(port, () => {
  console.log("Server is running on port " + port);
  console.log(process.env.STRIPE_PRIVATE_KEY);
});
