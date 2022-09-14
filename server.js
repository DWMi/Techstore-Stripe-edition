import express from "express";
import dotenv from 'dotenv'
dotenv.config()
import fetch from "node-fetch";
import Stripe from "stripe";
import { nanoid } from "nanoid";
import cookieSession from "cookie-session"
import bcrypt from "bcrypt"

let users = []

const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY);

const port = 3000;

const app = express();

app.use(express.json());
app.use("/", express.static("./client"));
app.use(cookieSession({
  secret:'aVeryS3cr3tK3y',
  maxAge: 1000 * 10,
  sameSite:'strict',
  httpOnly:true,
  secure:false 
}))


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

app.get('/users', (req,res)=>{
  res.json(users)
})

app.get('/login', (req, res)=>{
  if(req.session && req.session.signedInUser){
    res.json(req.session.signedInUser)
    return
  }
  res.json('Not longer signed in')
})

app.post('/login',async (req, res)=>{
  if(req.body.username && req.body.password){

      const foundUser = users.find(user => user.username == req.body.username)
      if(foundUser && bcrypt.compare(req.body.password, foundUser.password)){
          req.session.signedInUser = {
             id:nanoid(),
             user:foundUser,
             date: new Date(),
          }
          res.status(200).json("Successful signed in!")
          return
      }
      res.status(401).json("Incorrect password!!!")
      return
  }

res.status(401).json("Incorrect Username!!!")
})

app.delete('/login', (req,res)=>{
  if(req.session.signedInUser){

      req.session = null
      res.json('Signed Out')
    
  }
})

app.post("/register", async(req, res) => {

  if(req.body && req.body.username && req.body.password){

    const hashedPW = await bcrypt.hash(req.body.password, 10)

    users.push({
      id:nanoid(),
      username:req.body.username,
      password:hashedPW
    })

    res.json("New user has ben signed up")
    return
  }

  res.json("Incorrect info")
})



app.listen(port, () => {
  console.log("Server is running on port " + port);
});
