import { Orders } from "/lib/collections";
import { Reaction } from "/server/api";

/**
 * orders
 */

Meteor.publish("Orders", function () {
  if (this.userId === null) {
    return this.ready();
  }
  const shopId = Reaction.getShopId();
  if (!shopId) {
    return this.ready();
  }
  if (Roles.userIsInRole(this.userId, ["admin", "owner"], shopId)) {
    return Orders.find({
      shopId: shopId
    });
  } else if (Reaction.getVendorId(this.userId)) { // Check if this user has a shop
    return Orders.find({                        // return all orders from his shop.
      shopId: Reaction.getVendorId(this.userId) // TODO: When making order set storeID of
    });                                         // the vendor who registered the product.
  }
  return Orders.find({
    shopId: shopId,
    userId: this.userId
  });
});

/**
 * account orders
 */
Meteor.publish("AccountOrders", function (userId, currentShopId) {
  check(userId, Match.OptionalOrNull(String));
  check(currentShopId, Match.OptionalOrNull(String));
  if (this.userId === null) {
    return this.ready();
  }
  if (typeof userId === "string" && this.userId !== userId) {
    return this.ready();
  }
  const shopId = currentShopId || Reaction.getShopId();
  if (!shopId) {
    return this.ready();
  }
  return Orders.find({
    shopId: shopId,
    userId: this.userId
  });
});

/**
 * completed cart order
 */
Meteor.publish("CompletedCartOrder", function (userId, cartId) {
  check(userId, Match.OneOf(String, null));
  check(cartId, String);
  if (this.userId === null) {
    return this.ready();
  }
  if (typeof userId === "string" && userId !== this.userId) {
    return this.ready();
  }

  return Orders.find({
    cartId: cartId,
    userId: userId
  });
});
