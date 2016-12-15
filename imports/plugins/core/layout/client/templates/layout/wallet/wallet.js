import { Meteor } from "meteor/meteor";
import { Template } from "meteor/templating";

Template.wallet.events({
  "click #deposit": (event) => {
    event.preventDefault();
    const amount = parseInt(document.getElementById("depositAmount").value, 10);
    const transaction = {amount: amount, referenceId: "d8s8fjj983r83ejppu8d88ru34", date: new Date()};
    Meteor.call("wallet/transaction", Meteor.userId(), transaction, "deposit", (err, res) => {
      if (res) {
        document.getElementById("depositAmount").value = "";
        Alerts.toast("Your deposit was successful", "success");
      } else {
        Alerts.toast("An error occured, please try again", "error");
      }
    });
  }
});
