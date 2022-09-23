import express from "express";
import dotenv from "dotenv";
dotenv.config();
import { stripe } from "../server.js";
import * as fs from "fs";
import cookieSession from "cookie-session";
import { customAlphabet } from "nanoid";

const nanoid = customAlphabet("1234567890", 10);

export const router = express.Router();

let orders = [];
let orderData = fs.readFileSync("orders.json");
export let orderArr = JSON.parse(orderData);

router.use(
  cookieSession({
    secret: "aVeryS3cr3tK3y",
    maxAge: 1000 * 100000,
    sameSite: "strict",
    httpOnly: true,
    secure: false,
  })
);

router.post("/checkout", async (req, res) => {
  try {
    if (!req.session.signedInUser) {
      res.status(401).json("Not allowed!");
      return;
    }
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
      success_url: `${process.env.CLIENT_URL}/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cancel.html`,
    });

    res.json({ url: session.url });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get("/checkout/session", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(req.query.id, {
      expand: ["line_items.data.price.product", "customer"],
    });

    let paid = session.payment_status == "paid";

    if (!paid) {
      res.status(400);
      throw new Error("Payment failed");
    }

    let newOrder = {
      orderNumber: nanoid(),
      date: new Date().toISOString().split("T")[0],
      orderId: session.id,
      customer_id: session.customer,
      name: session.shipping_details.name,
      email: session.customer_details.email,
      billing_address: {
        city: session.customer.address.city,
        line1: session.customer.address.line1,
        postal_code: session.customer.address.postal_code,
      },
      shipping_address: {
        city: session.shipping_details.address.city,
        line1: session.shipping_details.address.line1,
        zip: session.shipping_details.address.postal_code,
      },
      total_amount: session.amount_total,
      products: session.line_items.data,
    };

    const foundOrder = orderArr.find((order) => order.orderId == session.id);

    if (!foundOrder) {
      orderArr.push(newOrder);
      orders = JSON.stringify(orderArr);
      fs.writeFile("orders.json", orders, (err) => {
        if (err) throw err;
      });
      return res.json("Order saved!");
    } else {
      res.json("Order already placed!");
    }
  } catch (err) {
    res.status(400).json("http://localhost:3000/error.html");
    console.log("No session found");
  }
});

router.get("/get-order", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(req.query.id, {
      expand: ["line_items.data.price.product", "customer"],
    });

    const foundOrder = orderArr.find((order) => order.orderId == session.id);

    if (foundOrder) {
      res.json(foundOrder);
    }
  } catch {
    res.status(400).json("http://localhost:3000/cancel.html");
    console.log("No order found");
  }
});
