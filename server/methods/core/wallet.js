import { Meteor } from "meteor/meteor";
import * as Collections from "/lib/collections";
import * as Schemas from "/lib/collections/schemas";
import { check, Match } from "meteor/check";

Meteor.methods({

  /**
   * wallet/deposit method to deposit money into user's account
   * @param {string} userId, the id of the user
   * @param {object} transaction, details of the transaction
   * @param {string} type, type of transaction done
   * @return {boolean} true or false if the db operation was successful
   */
  "wallet/transaction": (userId, transactions) => {
    check(userId, String);
    check(transactions, Schemas.Transaction);
    let balanceOptions;
    const {amount, transactionType} = transactions;
    if (transactionType === "Debit") {
      balanceOptions = {balance: amount};
    }
    if (transactionType === "Credit") {
      if (transactions.to) {
        const recipient = Collections.Accounts.findOne({"emails.0.address": transactions.to});
        const sender = Collections.Accounts.findOne(userId);
        if (!recipient) {
          return 2;
        }
        // deposit for the recipient
        Meteor.call("wallet/transaction", recipient._id, {
          amount,
          from: sender.emails[0].address,
          date: new Date(),
          transactionType: "Debit"
        });
      }
      balanceOptions = {balance: -amount};
    }

    try {
      Collections.Wallet.update({userId}, {$push: {transactions: transactions}, $inc: balanceOptions}, {upsert: true});
      return 1;
    } catch (error) {
      return 0;
    }
  },

  /**
   * wallet/deposit method to deposit money into user's account
   * @param {string} userId, the id of the user
   * @param {object} transaction, details of the transaction
   * @param {string} type, type of transaction done
   * @return {boolean} true or false if the db operation was successful
   */
  "wallet/getTransaction": (userId) => {
    check(userId, String);
    return Collections.Wallet.findOne({userId});
  }
});

// Meteor.publish("transactionDetails", () => {
//   return Collections.findOne({userId: this.userId});
// });
