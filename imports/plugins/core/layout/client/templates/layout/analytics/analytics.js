import { Meteor } from "meteor/meteor";
import { Template } from "meteor/templating";

Template.analyticsPage.helpers({
  userData() {
    return { newUsers: 2, existingUsers: 4 };
  }
});
