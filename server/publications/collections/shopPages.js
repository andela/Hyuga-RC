import { StaticPages } from "/lib/collections";

Meteor.publish("ShopPageByOwner", function (shopId) {
  check(shopId, Match.Maybe(String));
  if (!shopId) return this.ready();

  return StaticPages.find({
    shopId: shopId
  });
});
