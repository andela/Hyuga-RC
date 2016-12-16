import { Meteor } from "meteor/meteor";
import { Template } from "meteor/templating";

Template.wallet.events({
  "submit #deposit": (event) => {
    event.preventDefault();
    const amount = parseInt(document.getElementById("depositAmount").value, 10);
    const transaction = {amount: amount, referenceId: "d8s8fjj983r83ejppu8d88ru34", date: new Date(), transactionType: "Debit"};
    Meteor.call("wallet/transaction", Meteor.userId(), transaction, (err, res) => {
      if (res) {
        document.getElementById("depositAmount").value = "";
        Alerts.toast("Your deposit was successful", "success");
      } else {
        Alerts.toast("An error occured, please try again", "error");
      }
    });
  },

  "submit #transfer": (event) => {
    event.preventDefault();
    const amount = parseInt(document.getElementById("transferAmount").value, 10);
    const to = document.getElementById("recipient").value;
    const transaction = {amount, to, date: new Date(), transactionType: "Credit"};
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
      balance: 0,
      transactions: []
    });
    const instance = this;
    Meteor.call("wallet/getTransaction", Meteor.userId(), (err, res) => {
      if (res) {
        instance.state.set("balance", res.balance);
        instance.state.set("transactions", res.transactions);
      }
    });
  });
});

Template.wallet.helpers({
  balance: () => {
    return Template.instance().state.get("balance");
  },

  formatCurrency: (number) => {
    return number.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
  },

  getTransactions: () => {
    return Template.instance().state.get("transactions");
  }
});
