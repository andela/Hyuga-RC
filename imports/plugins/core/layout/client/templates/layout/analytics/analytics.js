import { Meteor } from "meteor/meteor";
import { Template } from "meteor/templating";


Template.analyticsPage.onCreated(function () {
  this.autorun(() => {
    this.clientId = ReactiveVar();
    const instance = this;
    Meteor.call("packages/getAnalyticsData", (err, res) => {
      instance.clientId.set(res.settings.public.googleAnalytics.client_id);
    });
  });
});

Template.analyticsPage.helpers({
  clientId() {
    return Template.instance().clientId.get();
  }
});

Template.loadAnalytics.helpers({
  getClientId() {
    return this.client;
  }
});
