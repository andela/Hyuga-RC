import { Meteor } from "meteor/meteor";
import * as Collections from "/lib/collections";

/**
 * Reaction Shop Methods
 */
Meteor.methods({
  /**
   * shop/getShopId
   * @param {string} userId: id of the logged in user
   * @return {object} shop details
   */
  "packages/getAnalyticsData": function () {
    return Collections.Packages.findOne({ name: "reaction-analytics" });
  }
});
