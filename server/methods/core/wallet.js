import { Meteor } from "meteor/meteor";
import { Wallet, Accounts } from "/lib/collections";
import * as Schemas from "/lib/collections/schemas";
import { check } from "meteor/check";

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
    if (transactionType === "Credit") {
      balanceOptions = {balance: amount};
    }
    if (transactionType === "Debit") {
      if (transactions.to) {
        const recipient = Accounts.findOne({"emails.0.address": transactions.to});
        const sender = Accounts.findOne(userId);
        if (!recipient) {
          return 2;
        }
        // deposit for the recipient
        Meteor.call("wallet/transaction", recipient._id, {
          amount,
          from: sender.emails[0].address,
          date: new Date(),
          transactionType: "Credit"
        });
      }
      balanceOptions = {balance: -amount};
    }

    try {
      Wallet.update({userId}, {$push: {transactions: transactions}, $inc: balanceOptions}, {upsert: true});
      return 1;
    } catch (error) {
      return 0;
    }
  },

  /**
   * wallet/refund method to return fund when an order is canceled
   * @param {string} userId the id of the logged in user
   * @param {string} orderid, the order reference id
   * @param {int} amount the amount to refund
   * @return {boolean} true if the refund was successful
   */
  "wallet/refund": (orderInfo) => {
    check(orderInfo, Schemas.Order);
    let amount = orderInfo.billing[0].invoice.total;
    if (orderInfo.workflow.status === "coreOrderWorkflow/completed") {
      amount -= orderInfo.billing[0].invoice.shipping;
    }
    const orderId = orderInfo._id;
    const transaction = {amount, orderId, transactionType: "Refund"};
    try {
      Wallet.update({userId}, {$push: {transactions: transaction}, $inc: {balance: amount}}, {upsert: true});
      return true;
    } catch (error) {
      return false;
    }
  }
});

Meteor.publish("transactionDetails", (userId) => {
  check(userId, String);
  return Wallet.find({userId});
});
