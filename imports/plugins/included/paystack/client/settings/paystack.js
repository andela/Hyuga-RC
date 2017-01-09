import { Template } from "meteor/templating";
import { Reaction } from "/client/api";
import { Packages } from "/lib/collections";
import { payStackConfig } from "../../lib/collections/schemas/paystackschema";

import "./paystack.html";

Template.paystackSettings.helpers({
  payStackConfig() {
    return payStackConfig;
  },
  packageData() {
    return Packages.findOne({
      name: "paystack",
      shopId: Reaction.getShopId()
    });
  }
});
