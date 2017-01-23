/* eslint camelcase: 0 */
import { Meteor } from "meteor/meteor";
import { Template } from "meteor/templating";
import { Reaction } from "/client/api";
import { Cart, Shops, Accounts, Packages } from "/lib/collections";

import "./paystack.html";

const getOrderPrice = () => {
  const cart = Cart.findOne();
  const shop = Shops.find({_id: cart.shopId}).fetch();
  const exchangeRate =  shop[0].currencies.NGN.rate;
  return parseInt(cart.cartTotal() * exchangeRate, 10);
};

const getPaystackSettings = () => {
  return Packages.findOne({
    name: "paystack",
    shopId: Reaction.getShopId()
  });
};

// Paystack payment
const payWithPaystack = (email, amount) => {
  const paystackDetails = getPaystackSettings();
  const handler = PaystackPop.setup({
    key: paystackDetails.settings.publickey,
    email: email,
    amount: amount * 100,
    callback: function (response) {
      handlePayment(response.reference, "payment");
    }
  });
  handler.openIframe();
};

Template.paystackPaymentForm.events({
  "click #paywithpaystack": (event) => {
    event.preventDefault();
    const accountDetails = Accounts.find(Meteor.userId()).fetch();
    const userMail = accountDetails[0].emails[0].address;
    const amount = getOrderPrice();
    const mailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!mailRegex.test(userMail)) {
      Alerts.toast("Invalid email address", "error");
      return false;
    }
    payWithPaystack(userMail, amount);
  }
});

Template.paystackPaymentForm.helpers({
  PaystackSchema() {
    return PaystackSchema;
  },
  generateTransactionID() {
    return Random.id();
  },
  getCustomerEmail() {
    const user = Meteor.users.findOne(Meteor.userId());
    return user.emails[0].address;
  }
});
