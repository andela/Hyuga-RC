import { SimpleSchema } from "meteor/aldeed:simple-schema";
import { PackageConfig } from "/lib/collections/schemas/registry";

export const payStackConfig = new SimpleSchema([
  PackageConfig, {
    "settings.secretkey": {
      type: String,
      label: "Secret Key"
    },
    "settings.publickey": {
      type: String,
      label: "Public Key"
    }
  }
]);
