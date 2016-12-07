import _ from "lodash";
import { Session } from "meteor/session";
import { Template } from "meteor/templating";
import { Reaction } from "/client/api";
import Logger from "/client/modules/logger";
import { $ } from "meteor/jquery";
import { ReactionProduct } from "/lib/api";
import Sortable from "sortablejs";
/**
 * productGrid helpers
 */

Template.productSearchTags.onCreated(function () {

});

Template.productSearchTags.helpers(function () {

});
Template.productSearchTags.events({
  "click [class=filter]": (event) => {
    $(".product-small").addClass("zIndex");
  }
});
