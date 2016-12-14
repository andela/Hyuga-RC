import { Meteor } from "meteor/meteor";
import Wallet from "/lib/collections";
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
    let pushOptions;
    if (type === "deposit") {
      pushOptions = {deposits: {amount: transaction.amount, referenceId: transaction.reference}};
    }
    if (type === "payment") {
      pushOptions = {payment: {amount: transaction.amount, orderId: transaction.orderId}};
    }

    if (type === "transfer") {
      pushOptions = {transfers: {amount: transaction.amount, recipient: transaction.recipient}};
    }
    Wallet.update({userId}, pushOptions)
      .then(()=> {
        console.log('Done');
        return true;
      }).catch((error) => {
        console.log(error);
        return false;
      });
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
