import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
import {StaticPages } from "/lib/collections";
import * as Collections from "/lib/collections";
import * as Schemas from "/lib/collections/schemas";

Meteor.methods({
  /**
   * @summary - Creates a Static Page
   * @param{String} name - The name of the page
   * @param{String} title - The title of the page
   * @param{String} body - The body of the page
   */
  "pages.insert"(name, title, body) {
    check(name, String);
    check(title, String);
    check(body, String);

    const url = `pages/${name.replace(" ", "-").toLowerCase()}`;
    let shopId;
    Meteor.call("shop/getShopId", Meteor.userId(), (err, res) => {
      shopId = res._id;
    });
    const page = {
      pageName: name,
      pageRoute: url,
      pageTitle: title,
      pageBody: body,
      pageOwner: Meteor.userId(),
      shopId: shopId,
      createdAt: new Date
    };
    check(page, Schemas.staticPages);
    Collections.StaticPages.insert(page);
  },

  /**
   * @summary - Updates a Static Page
   * @param{String} pageId - The page to be updated
   * @param{String} name - The new name for the page
   * @param{String} title - The new title for the page
   * @param{String} body - The new body for the page
   */
  "pages.update"(pageId, name, title, body) {
    check(pageId, String);
    check(name, String);
    check(title, String);
    check(body, String);

    StaticPages.update(pageId, {
      $set: {
        pageName: name,
        pageTitle: title,
        pageBody: body
      }
    });
  },

  /**
   * @summary - Deletes a Static Page
   * @param{String} pageId - The id of the page
   */
  "pages.delete"(pageId) {
    check(pageId, String);

    StaticPages.remove(pageId);
  }
});
