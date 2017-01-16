import { Shipping } from "/lib/collections";
import { Reaction } from "/server/api";

/**
 * shipping
 */

Meteor.publish("Shipping", function () {
  const shopId = Reaction.getShopId();
  console.log(shopId);
  if (!shopId) {
    return this.ready();
  }
  return Shipping.find({
    shopId: shopId
  });
});
