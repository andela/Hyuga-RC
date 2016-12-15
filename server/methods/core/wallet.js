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
  "wallet/transaction": (userId, transaction, type) => {
    check(userId, String);
    check(type, String);
    let pushOptions, balanceOptions;
    const {amount, date} = transaction;
    const basicInfo = {amount, date};
    if (type === "deposit") {
      check(transaction, Schemas.Deposits);
      if (transaction.referenceId) {
        basicInfo.referenceId = transaction.referenceId;
      }
      if (transaction.from) {
        basicInfo.from = transaction.from;
      }
      pushOptions = {deposits: basicInfo};
      balanceOptions = {balance: amount};
    }
    if (type === "payment") {
      check(transaction, Schemas.Withdrawals);
      basicInfo.orderId = transaction.orderId;
      if (transaction.to) {
        const recipient = Collections.Accounts.findOne({"emails.0.address": transaction.to});
        const sender = Collections.Accounts.findOne(userId);
        if (!recipient) {
          return 2;
        }
        // deposit for the recipient
        Meteor.call("wallet/transaction", recipient._id, {amount, from: sender.emails[0].address, date: new Date()}, "deposit");
        basicInfo.to = transaction.to;
      }
      pushOptions = {withdrawals: basicInfo};
      balanceOptions = {balance: -amount};
    }

    try {
      Collections.Wallet.update({userId}, {$push: pushOptions, $inc: balanceOptions}, {upsert: true});
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
    return Wallet.findOne({userId});
  }
});
