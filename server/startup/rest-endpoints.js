import { Accounts, Cart, Orders, Products, Shops } from "/lib/collections";

export default () => {
  const Api = new Restivus({
    useDefaultAuth: true,
    prettyJson: true
  });

  const options = {
    excludedEndpoints: ["delete"]
  };

  Api.addCollection(Accounts, options);
  Api.addCollection(Cart, options);
  Api.addCollection(Orders, options);
  Api.addCollection(Products, options);
  Api.addCollection(Shops, options);
};
