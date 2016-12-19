/* eslint camelcase: 0 */
import { Meteor } from "meteor/meteor";
import { Template } from "meteor/templating";
import { Cart, Shops, Accounts } from "/lib/collections";
// import { PaystackSchema } from "../../lib/collections/schemas";

import "./paystack.html";

const getOrderPrice = () => {
  const cart = Cart.findOne();
  const shop = Shops.find({_id: cart.shopId}).fetch();
  const exchangeRate =  shop[0].currencies.NGN.rate;
  return parseInt(cart.cartTotal() * exchangeRate, 10);
};

const handlePayment = (transactionId) => {
  HTTP.call("GET", `https://api.paystack.co/transaction/verify/${transactionId}`,
  {headers: {Authorization: "Bearer sk_test_d09c5600204ad4b0af2b239a468fb8b5fe981c50"}},
  function (error, response) {
    if (error) {
      Alerts.toast("Unable to verify payment", "error");
    } else if (response.data.data.status !== 'success') {
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
  const handler = PaystackPop.setup({
    key: "pk_test_bc91df13224e8a49c9080692f77cc529378b916f",
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
