import express from "express";
import fetch from "node-fetch";
import Stripe from "stripe";

const port = 3000;

const app = express();

app.use(express.json());
app.use("/", express.static("./client"));






app.listen(port, () => {
  console.log("Server is running on port " + port);
});
