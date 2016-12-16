import { Meteor } from "meteor/meteor";
import { Template } from "meteor/templating";
import { Accounts } from "/lib/collections";

Template.wallet.events({
  "click #deposit": (event) => {
    event.preventDefault();
    const accountDetails = Accounts.find(Meteor.userId()).fetch();
    const userMail = accountDetails[0].emails[0].address;
    const amount = parseInt(document.getElementById("depositAmount").value, 10);

    payWithPaystack(userMail, amount);
  }
});

// Paystack payment
payWithPaystack = (email, amount) => {
  const handler = PaystackPop.setup({
    key: "pk_test_2594e8950a3a70fc754d143c4fc6721e8138f70c",
    email: email,
    amount: amount * 100,
    callback: function (response) {
      const transaction = { amount: amount, referenceId: response.reference, date: new Date() };
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
  handler.openIframe();
};

