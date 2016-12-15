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
    check(transaction, Schemas.Deposits);
    let pushOptions, balanceOptions;
    const {amount, date} = transaction;
    const basicInfo = {amount, date};
    if (type === "deposit") {
      basicInfo.referenceId = transaction.referenceId;
      pushOptions = {deposits: basicInfo};
      balanceOptions = {balance: amount};
    }
    if (type === "payment") {
      pushOptions = {payment: {amount: transaction.amount, orderId: transaction.orderId}};
    }

    if (type === "transfer") {
      pushOptions = {transfers: {amount: transaction.amount, recipient: transaction.recipient}};
    }

    try {
      Collections.Wallet.update({userId}, {$push: pushOptions, $inc: balanceOptions}, {upsert: true});
      return true;
    } catch (error) {
      return false;
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
