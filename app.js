const express = require('express');
const app = express();
const connecttomongo = require('./db');
const cors = require('cors')
const User = require('./model/user.js')
async function initializeStripe() {
  const admin = await User.findOne({ role: "admin" });
  const stripe = require('stripe')(admin.api_key);

  return stripe;
}



const bodyParser = require('body-parser')
const cloudinary = require('cloudinary')
const errorMiddleware = require('./middlewares/error.js')
app.use(cors())
connecttomongo();
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.json({ limit: '50mb' }));
cloudinary.config({
  cloud_name: "dfxlbsgzh",
  api_key: "137567235279886",
  api_secret: "UWzrLp3_nMb29HMPWf3s0zkV3V0"
});
app.use('/api/user', require('./routes/user.js'))
app.use('/api/admin', require('./routes/admin.js'))
app.use("/payment/create", async (req, res) => {
  try {
    const stripe = await initializeStripe()
    const total = req.body.total;
    const payment = await stripe.paymentIntents.create({ amount: total * 100, currency: 'usd' });
    res.status(201).send({ clientsecret: payment.client_secret })
  } catch (error) {
    res.status(405).send('Error is ' + error)
  }

});

app.use(errorMiddleware);
module.exports = app;