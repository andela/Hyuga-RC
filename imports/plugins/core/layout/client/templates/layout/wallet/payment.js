import { Meteor } from "meteor/meteor";
import { Reaction } from "/client/api";
import { Packages, Shops } from "/lib/collections";

finalizePayment = (paystackMethod) => {
  Meteor.call("cart/submitPayment", paystackMethod);
};

getPaystackConfig = () => {
  return Packages.findOne({
    name: "paystack",
    shopId: Reaction.getShopId()
  });
};

finalizeDeposit = (paystackMethod) => {
  Meteor.call("wallet/transaction", Meteor.userId(), paystackMethod.transactions, (err, res) => {
    if (res) {
      document.getElementById("depositAmount").value = "";
      Alerts.toast("Your deposit was successful", "success");
    } else {
      Alerts.toast("An error occured, please try again", "error");
    }
  });
};

handlePayment = (transactionId, type) => {
  const paystackConfig = getPaystackConfig();
  HTTP.call("GET", `https://api.paystack.co/transaction/verify/${transactionId}`, {
    headers: {
      Authorization: `Bearer ${paystackConfig.settings.secretkey}`
    }
  }, function (error, response) {
    if (error) {
      Alerts.toast("Unable to verify payment", "error");
    } else if (response.data.data.status !== "success") {
      Alerts.toast("Payment was unsuccessful", "error");
    } else {
      const exchangeRate = getExchangeRate();
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
        createdAt: new Date()
      };
      if (type === "payment") {
        paystackMethod.transactions = [];
        paystackMethod.transactions.push({
          amount: (paystackResponse.amount / 100),
          transactionId: paystackResponse.reference,
          currency: paystackResponse.currency
        });
        finalizePayment(paystackMethod);
      } else if (type === "deposit") {
        paystackMethod.transactions = {
          amount: paystackResponse.amount / (100 * exchangeRate),
          referenceId: paystackResponse.reference,
          date: new Date(),
          transactionType: "Credit"
        };
        finalizeDeposit(paystackMethod);
      }
    }
  });
};

getExchangeRate = () => {
  const shop = Shops.find(Reaction.getShopId()).fetch();
  return shop[0].currencies.NGN.rate;
};
