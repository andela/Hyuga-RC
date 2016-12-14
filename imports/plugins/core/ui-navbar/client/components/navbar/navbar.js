import { Meteor } from "meteor/meteor";
import { FlatButton } from "/imports/plugins/core/ui/client/components";
import { Reaction } from "/client/api";
import { Tags } from "/lib/collections";

Template.CoreNavigationBar.onCreated(function () {
  this.state = new ReactiveDict();
  this.notification = ReactiveVar();

  // Create an auto run to Check for notifications on page load
  // and set the notification reactive variable.
  this.autorun(() => {
    const instance = this;
    Meteor.call("notifications/getNotifications", Meteor.userId(), (err, res) => {
      instance.notification.set(!!res);
    });
  });
});

/**
 * layoutHeader events
 */
Template.CoreNavigationBar.events({
  "click .navbar-accounts .dropdown-toggle": function () {
    return setTimeout(function () {
      return $("#login-email").focus();
    }, 100);
  },
  "click .header-tag, click .navbar-brand": function () {
    return $(".dashboard-navbar-packages ul li").removeClass("active");
  },
  "click .search": function () {
    Blaze.renderWithData(Template.searchModal, {
    }, $("body").get(0));
    $("body").css("overflow", "hidden");
    $("#search-input").focus();
  }
});

Template.CoreNavigationBar.helpers({
  IconButtonComponent() {
    return {
      component: FlatButton,
      icon: "fa fa-search",
      kind: "flat"
      // onClick() {
      //   Blaze.renderWithData(Template.searchModal, {
      //   }, $("body").get(0));
      //   $("body").css("overflow-y", "hidden");
      //   $("#search-input").focus();
      // }
    };
  },
  NotificationButtonComponent() {
    // Check if the user has pending notifications
    // and set the appropriate Icon
    let bell = (Template.instance().notification.get())
    ? "fa fa-bell"
    : "fa fa-bell-o";
    return {
      component: FlatButton,
      icon: bell,
      kind: "flat"
      // onClick() {
      //   Blaze.renderWithData(Template.searchModal, {
      //   }, $("body").get(0));
      //   $("body").css("overflow-y", "hidden");
      //   $("#search-input").focus();
      // }
    };
  },
  onMenuButtonClick() {
    const instance = Template.instance();
    return () => {
      if (instance.toggleMenuCallback) {
        instance.toggleMenuCallback();
      }
    };
  },

  tagNavProps() {
    const instance = Template.instance();
    let tags = [];

    tags = Tags.find({
      isTopLevel: true
    }, {
      sort: {
        position: 1
      }
    }).fetch();

    return {
      name: "coreHeaderNavigation",
      editable: Reaction.hasAdminAccess(),
      isEditing: true,
      tags: tags,
      onToggleMenu(callback) {
        // Register the callback
        instance.toggleMenuCallback = callback;
      }
    };
  }
});
