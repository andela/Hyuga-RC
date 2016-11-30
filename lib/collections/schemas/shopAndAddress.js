import { SimpleSchema } from "meteor/aldeed:simple-schema";

export const ShopAndAddress = new SimpleSchema({
  test: {
    label: "Test",
    type: String
  }
});
