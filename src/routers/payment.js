const express = require("express");
const paymentRouter = express.Router();
const razorpayInstance = require("../helpers/razorpay");
const userAuth = require("../middlewares/auth");
const subscriptionPrices = require("../helpers/constants");
const Payment = require("../models/payment");
const {
  validateWebhookSignature,
} = require("razorpay/dist/utils/razorpay-utils");
const User = require("../models/user");

paymentRouter.post("/payment/create", userAuth, async (req, res) => {
  try {
    const { subscriptionType } = req.body;
    const { firstName, lastName, emailId } = req.user;
    const order = await razorpayInstance.orders.create({
      amount: Number(subscriptionPrices[subscriptionType]) * 100,
      currency: "INR",
      receipt: "receipt#1",
      notes: {
        firstName,
        lastName,
        emailId,
        membershipType: subscriptionType,
      },
    });

    const payment = new Payment({
      userId: req.user._id,
      orderId: order.id,
      status: order.status,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      notes: order.notes,
    });

    await payment.save();

    res.json({ ...payment.toJSON(), keyId: process.env.RAZORPAY_KEY_ID });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
});

paymentRouter.post("/payment/webhook", async (req, res) => {
  try {
    const webhookSignature = req.get("X-Razorpay-Signature");


    const isValidWebhook = validateWebhookSignature(
      JSON.stringify(req.body),
      webhookSignature,
      process.env.RAZORPAY_WEBHOOK_SECRET,
    );

    if (!isValidWebhook) {
      return res.status(400).json({ msg: "Invalid webhook signature" });
    }

    const paymentDetails = req.body.payload.payment.entity;

    const payment = await Payment.findOne({ orderId: paymentDetails.order_id });
    payment.status = paymentDetails.status;
    await payment.save();

    const user = await User.findOne({ _id: payment.userId });
    user.isPremium = true;
    user.memberShipType = payment.notes.membershipType;
    await user.save();

    res.status(200).json({ msg: "Webhook triggered successfully" });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
});

module.exports = paymentRouter;
