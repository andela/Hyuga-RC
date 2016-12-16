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
    const amount = parseInt(document.getElementById("transferAmount").value, 10);
    const to = document.getElementById("recipient").value;
    const transaction = {amount, to, date: new Date(), transactionType: "Debit"};
    Meteor.call("wallet/transaction", Meteor.userId(), transaction, (err, res) => {
      if (res === 2) {
        Alerts.toast(`No user with email ${to}`, "error");
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
      details: {balance: 0, transactions: []}
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

  formatCurrency: (number) => {
    return number.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
  },

  getTransactions: () => {
    return Template.instance().state.get("details").transactions;
  }
});

// Paystack payment
payWithPaystack = (email, amount) => {
  const handler = PaystackPop.setup({
    key: "pk_test_2594e8950a3a70fc754d143c4fc6721e8138f70c",
    email: email,
    amount: amount * 100,
    callback: function (response) {
      const transaction = { amount: amount, referenceId: response.reference, date: new Date(), transactionType: "Credit" };
      Meteor.call("wallet/transaction", Meteor.userId(), transaction, (err, res) => {
        if (res) {
          document.getElementById("depositAmount").value = "";
          Alerts.toast("Your deposit was successful", "success");
        } else {
          Alerts.toast("An error occured, please try again", "error");
        }
      });
    }
  });
  handler.openIframe();
};
