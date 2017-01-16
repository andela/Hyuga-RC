import { Accounts, Cart, Orders, Products, Shops } from "/lib/collections";

export default () => {
  const Api = new Restivus({
    useDefaultAuth: true,
    prettyJson: true
  });

  const getOptions = (collection) => {
    return {
      excludedEndpoints: ["delete"],
      endpoints: {
        put: {
          action() {
            const isUpdated = collection.update(this.urlParams.id, {
              $set: this.bodyParams
            });

            if (isUpdated) {
              const record = collection.findOne(this.urlParams.id);

              return { status: "success", data: record };
            }

            return {
              statusCode: 404,
              body: { status: "fail", message: "Item not found", body: this.bodyParams }
            };
          }
        }
      }
    };
  };

  Api.addCollection(Accounts, getOptions(Accounts));
  Api.addCollection(Cart, getOptions(Cart));
  Api.addCollection(Orders, getOptions(Orders));
  Api.addCollection(Shops, getOptions(Shops));
  Api.addCollection(Products, getOptions(Products));
};
