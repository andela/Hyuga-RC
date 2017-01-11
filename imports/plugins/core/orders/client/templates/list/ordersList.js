import moment from "moment";
import { Template } from "meteor/templating";
import { Orders, Shops, Packages } from "/lib/collections";
import { i18next } from "/client/api";

Template.dashboardOrdersList.onCreated(function () {
  this.state = new ReactiveDict();
  this.state.setDefault({
    feeds: {}
  });

  this.autorun(() => {
    this.subscribe("Packages");
    const feedsConfig = Packages.findOne({
      name: "reaction-social"
    });
    this.state.set("feeds", feedsConfig.settings.public.apps);
  });
});
/**
 * dashboardOrdersList helpers
 *
 */
Template.dashboardOrdersList.helpers({
  orderStatus() {
    if (this.workflow.status === "coreOrderWorkflow/completed") {
      return i18next.t("order.completed");
    } else if (this.workflow.status === "canceled") {
      return "Canceled";
    }

    return i18next.t("order.processing");
  },
  orders(data) {
    if (data.hash.data) {
      return data.hash.data;
    }
    return Orders.find({}, {
      sort: {
        createdAt: -1
      },
      limit: 25
    });
  },
  orderAge() {
    console.log('andela-hyuga-rc.herokuapp.com' + FlowRouter.current().path);
    return moment(this.createdAt).fromNow();
  },
  shipmentTracking() {
    return this.shipping[0].shipmentMethod.tracking;
  },
  shopName() {
    const shop = Shops.findOne(this.shopId);
    return shop !== null ? shop.name : void 0;
  },
  hasComment() {
    return this.comments.length > 0;
  },
  facebookUrl() {
    const encodedURL = encodeURIComponent("https://andela-hyuga-rc.herokuapp.com" + FlowRouter.current().path);
    const facebookConfig = Template.instance().state.get("feeds").facebook;
    if (facebookConfig.appId !== "" && facebookConfig.enabled) {
      return `https://www.facebook.com/plugins/share_button.php?href=${encodedURL}&layout=button_count&size=small&mobile_iframe=false&width=88&height=20&appId=${facebookConfig.appId}`
    }
    return false;
  }
});
