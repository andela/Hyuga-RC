import { Template } from "meteor/templating";
import { Media } from "/lib/collections";
import { NumericInput } from "/imports/plugins/core/ui/client/components";
import { Reaction } from "/client/api";


Template.ordersListItems.onCreated(function () {
  this.shopId = ReactiveVar();

  this.autorun(() => {
    if (Reaction.hasPermission("Admin")) {
      this.shopId.set(Reaction.getShopId());
    } else if (Reaction.hasPermission("createProduct")) {
      const instance = this;
      Meteor.call("shop/getShopId", Meteor.userId(), (err, res) => {
        instance.shopId.set(res._id);
      });
    }
  });
});
/**
 * ordersListItems helpers
 *
 */
Template.ordersListItems.helpers({
  media: function () {
    const variantImage = Media.findOne({
      "metadata.productId": this.productId,
      "metadata.variantId": this.variants._id
    });
    // variant image
    if (variantImage) {
      return variantImage;
    }
    // find a default image
    const productImage = Media.findOne({
      "metadata.productId": this.productId
    });
    if (productImage) {
      return productImage;
    }
    return false;
  },

  items() {
    const { order } = Template.instance().data;
    const combinedItems = [];

    if (order) {
      // Lopp through all items in the order. The items are split into indivital items
      for (const orderItem of order.items) {
        if (orderItem.shopId !== Template.instance().shopId.get()) {
          continue;
        }
        // Find an exising item in the combinedItems array
        const foundItem = combinedItems.find((combinedItem) => {
          // If and item variant exists, then we return true
          if (combinedItem.variants) {
            return combinedItem.variants._id === orderItem.variants._id;
          }

          return false;
        });

        // Increment the quantity count for the duplicate product variants
        if (foundItem) {
          foundItem.quantity++;
        } else {
          // Otherwise push the unique item into the combinedItems array
          combinedItems.push(orderItem);
        }
      }

      return combinedItems;
    }

    return false;
  },

  numericInputProps(value) {
    const { currencyFormat } = Template.instance().data;

    return {
      component: NumericInput,
      value,
      format: currencyFormat,
      isEditing: false
    };
  }
});
