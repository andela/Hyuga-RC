import { Meteor } from "meteor/meteor";
import { Template } from "meteor/templating";
import { Wallet, Accounts } from "/lib/collections";

Template.wallet.events({
  "submit #deposit": (event) => {
    event.preventDefault();
    const accountDetails = Accounts.find(Meteor.userId()).fetch();
    const userMail = accountDetails[0].emails[0].address;
    const amount = parseInt(document.getElementById("depositAmount").value, 10);
    const mailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!mailRegex.test(userMail)) {
      Alerts.toast("Invalid email address", "error");
      return false;
    }
    payWithPaystack(userMail, amount);
  },

  "submit #transfer": (event) => {
    event.preventDefault();
    let amount = parseInt(document.getElementById("transferAmount").value, 10);
    if (amount > Template.instance().state.get("details").balance) {
      Alerts.toast("Insufficient Balance", "error");
      return false;
    }
    const recipient = document.getElementById("recipient").value;
    amount /= getExchangeRate();
    const transaction = { amount, to: recipient, date: new Date(), transactionType: "Debit" };
    Meteor.call("wallet/transaction", Meteor.userId(), transaction, (err, res) => {
      if (res === 2) {
        Alerts.toast(`No user with email ${recipient}`, "error");
      } else if (res === 1) {
        document.getElementById("recipient").value = "";
        document.getElementById("transferAmount").value = "";
        Alerts.toast("The transfer was successful", "success");
      } else {
        Alerts.toast("An error occured, please try again", "error");
      }
    });
  }
});

Template.wallet.onCreated(function () {
  this.state = new ReactiveDict();
  this.autorun(() => {
    this.state.setDefault({
      details: { balance: 0, transactions: [] }
    });
    this.subscribe("transactionDetails", Meteor.userId());
    const transactionInfo = Wallet.find().fetch();
    this.state.set("details", transactionInfo[0]);
  });
});

Template.wallet.helpers({
  balance: () => {
    return Template.instance().state.get("details").balance;
  },

  getTransactions: () => {
    return Template.instance().state.get("details").transactions;
  }
});

// Paystack payment
payWithPaystack = (email, amount) => {
  const paystackConfig = getPaystackConfig();
  const handler = PaystackPop.setup({
    key: paystackConfig.settings.publickey,
    email: email,
    amount: amount * 100,
    callback: function (response) {
      handlePayment(response.reference, "deposit");
    }
  });
  handler.openIframe();
};
