import { Meteor } from "meteor/meteor";
import * as Collections from "/lib/collections";

/**
 * Reaction Shop Methods
 */
Meteor.methods({
  /**
   * packages/getAnalyticsData
   * @return {object} package details
   */
  "packages/getAnalyticsData": function () {
    return Collections.Packages.findOne({ name: "reaction-analytics" });
  }
});
