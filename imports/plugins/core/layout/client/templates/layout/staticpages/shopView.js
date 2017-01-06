import { StaticPages } from "/lib/collections";
import { Template } from "meteor/templating";
// import { Meteor } from "meteor/meteor";

Template.shopView.onCreated(function () {
  this.autorun(() => {
    this.subscribe("ShopPageByOwner", FlowRouter.getParam("shopId"));
  });
});

Template.shopView.helpers({
  /**
   * @return {Array} The array of data for the page gotten from the database
   */
  shopPage() {
    const shopPages = StaticPages.find().fetch();
    return shopPages;
  }
});
