const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const stripeSec = process.env.STRIPE_KEY;

if (!stripeSec) {
  console.error("Stripe key is missing");
  throw new Error("Stripe key is missing");
}

const stripe = require("stripe")(stripeSec);

const app = express();
app.use(cors({ origion: true }));

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    message: "success",
  });
});

app.post("/payment/create", async (req, res) => {
  const total = req.query.total;
  if (total > 0) {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: total,
      currency: "USD",
    });

    res.status(200).json({
      // paymentIntent
      clientPaymentSecret: paymentIntent.client_secret,
    });

    // console.log(`total payment requested is: ${total}`)
    // res.send(`total payment requested is: ${total}`)
  } else {
    res.status(403).json({
      message: "Payment amount must be greater than zero (0).",
    });
  }
});

app.listen(5000, (err) => {
  if (err) {
    console.log(err);
  }
  console.log(`Amazon server running on port: 5000 on http://localhost:5000`);
});
