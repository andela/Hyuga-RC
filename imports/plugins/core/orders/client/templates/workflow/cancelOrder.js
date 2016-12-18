import { Meteor } from "meteor/meteor";
import { Template } from "meteor/templating";

Template.coreOrderCancelOrder.onCreated(function () {
  this.state = new ReactiveDict();

  this.autorun(() => {

  });
});
