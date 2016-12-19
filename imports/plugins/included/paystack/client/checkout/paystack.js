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

const handlePayment = (transactionId) => {
  const paystackDetails = getPaystackSettings();
  HTTP.call("GET", `https://api.paystack.co/transaction/verify/${transactionId}`,
  {headers: {Authorization: `Bearer ${paystackDetails.settings.secretkey}`}},
  function (error, response) {
    if (error) {
      Alerts.toast("Unable to verify payment", "error");
    } else if (response.data.data.status !== "success") {
      Alerts.toast("Payment was unsuccessful", "error");
    } else {
      const paystackResponse = response.data.data;
      paystackMethod = {
        processor: "Paystack",
        storedCard: paystackResponse.authorization.last4,
        method: "Paystack",
        transactionId: paystackResponse.reference,
        currency: paystackResponse.currency,
        amount: paystackResponse.amount,
        status: paystackResponse.status,
        mode: "authorize",
        createdAt: new Date(),
        transactions: []
      };
      const transactionObject = {
        amount: (paystackResponse.amount / 100),
        transactionId: paystackResponse.reference,
        currency: paystackResponse.currency
      };
      paystackMethod.transactions.push(transactionObject);
      Meteor.call("cart/submitPayment", paystackMethod);
    }
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
      handlePayment(response.reference);
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
