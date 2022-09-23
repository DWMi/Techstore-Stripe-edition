import express from 'express'
import dotenv from "dotenv";
dotenv.config();
import { stripe } from '../server.js'
import * as fs from "fs"
import cookieSession from "cookie-session";
import bcrypt from "bcrypt";
import { nanoid } from "nanoid";


export const router = express.Router()

let users = []
let userData = fs.readFileSync('users.json')
let userArr = JSON.parse(userData)

router.use(
  cookieSession({
    secret: "aVeryS3cr3tK3y",
    maxAge: 1000 * 100000,
    sameSite: "strict",
    httpOnly: true,
    secure: false,
  })
);

router.post("/register", async (req, res) => {
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
      address: {
        line1: req.body.address,
        city: req.body.city,
        postal_code: req.body.zip,
      },
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

router.post("/login", async (req, res) => {
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

router.get("/checkLogin", (req, res) => {
  if (req.session && req.session.signedInUser) {
    const user = {
      id: req.session.signedInUser.user.id,
      email: req.session.signedInUser.user.email,
      name: req.session.signedInUser.user.username,
      loggedIn: true,
      address: {
        line1: req.session.signedInUser.user.address,
        city: req.session.signedInUser.user.city,
        postal_code: req.session.signedInUser.user.zip,
      },
    };
    res.json(user);
    return;
  }
  res.json({ loggedIn: false });
});


router.delete("/logout", (req, res) => {
  if (req.session) {
    req.session = null;
    res.json("logged out");
  }
});
