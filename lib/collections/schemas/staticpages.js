import { SimpleSchema } from "meteor/aldeed:simple-schema";

/**
 * Reaction Schemas Static Pages
 */

export const staticPages = new SimpleSchema({
  pageName: {
    type: String,
    index: 1,
    label: "Page Name"
  },
  pageTitle: {
    type: String,
    index: 1,
    label: "Page Title"
  },
  pageRoute: {
    type: String,
    index: 1,
    label: "Page Route"
  },
  pageBody: {
    type: String,
    optional: true,
    index: 1
  },
  pageOwner: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    index: 1,
    label: "Page Owner userId"
  },
  shopId: {
    type: String,
    optional: true,
    label: "Shop Id"
  },
  createdAt: {
    type: Date,
    autoValue() {
      if (this.isInsert) {
        return new Date;
      } else if (this.isUpsert) {
        return {
          $setOnInsert: new Date
        };
      }
    }
  },
  updatedAt: {
    type: Date,
    autoValue() {
      if (this.isUpdate) {
        return {
          $set: new Date
        };
      } else if (this.isUpsert) {
        return {
          $setOnInsert: new Date
        };
      }
    },
    optional: true
  }
});
