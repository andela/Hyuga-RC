import { StaticPages } from "/lib/collections";

Template.pageView.onCreated(function () {
  this.subscribe("Pages");
});

Template.pageView.helpers({
  /**
   * @param {String} pageRoute - The route of the page that is to be returned
   * @return {Array} The array of data for the page gotten from the database
   */
  singlePage(pageRoute) {
    const page = StaticPages.findOne({
      pageRoute: `pages/${pageRoute}`
    });
    const pageData = [page];
    return pageData;
  }
});
