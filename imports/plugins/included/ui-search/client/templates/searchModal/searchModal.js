import _ from "lodash";
import React from "react";
import { DataType } from "react-taco-table";
import { Template } from "meteor/templating";
import { i18next } from "/client/api";
import { ProductSearch, Tags, OrderSearch, AccountSearch } from "/lib/collections";
import { IconButton, SortableTable } from "/imports/plugins/core/ui/client/components";
import { Session } from "meteor/session";

/*
 * searchModal extra functions
 */
function tagToggle(arr, val) {
  if (arr.length === _.pull(arr, val).length) {
    arr.push(val);
  }
  return arr;
}

/*
 * searchModal onCreated
 */
Template.searchModal.onCreated(function () {
  this.state = new ReactiveDict();
  this.state.setDefault({
    initialLoad: true,
    slug: "",
    canLoadMoreProducts: false,
    searchQuery: "",
    productSearchResults: [],
    tagSearchResults: [],
    suggestionSearchResults: []
  });


  // Allow modal to be closed by clicking ESC
  // Must be done in Template.searchModal.onCreated and not in Template.searchModal.events
  $(document).on("keyup", (event) => {
    if (event.keyCode === 27) {
      const view = this.view;
      $(".js-search-modal").fadeOut(400, () => {
        $("body").css("overflow", "visible");
        Blaze.remove(view);
      });
    }
  });

  let brands = [];
  this.autorun(() => {
    const searchCollection = this.state.get("searchCollection") || "products";
    const searchQuery = this.state.get("searchQuery");
     const brandPicked = this.state.get("brandPicked");
    const priceRange = this.state.get("priceRange");
    const facets = this.state.get("facets") || [];
    const sub = this.subscribe("SearchResults", searchCollection, searchQuery,
      facets, priceRange, brandPicked);

    if (sub.ready()) {
      /*
       * Product Search
       */
      if (searchCollection === "products") {
        const rangeBestSeller = this.state.get("bestSellers");
        let bestSort = "";
        switch (rangeBestSeller) {
          case "high-low":
            bestSort = -1;
            break;

          case "low-high":
            bestSort = 1;
            break;

          default:
            break;
        }
        const productResults = ProductSearch.find({}, {
          sort:
          { numSold: bestSort }
        }).fetch();
        const productResultsCount = productResults.length;
        this.state.set("productSearchResults", productResults);
        this.state.set("productSearchCount", productResultsCount);
        const hashtags = [];
        for (const product of productResults) {
          if (product.hashtags) {
            for (const hashtag of product.hashtags) {
              if (!_.includes(hashtags, hashtag)) {
                hashtags.push(hashtag);
              }
            }
          }

          if (product.brand) {
            if (!_.includes(brands, product.brand)) {
              brands.push(product.brand);
            }
          }
        }
        const tagResults = Tags.find({
          _id: { $in: hashtags }
        }).fetch();

        const suggestionsResult = productResults.map(product => product.title);

        this.state.set("suggestionSearchResults", suggestionsResult);
        this.state.set("tagSearchResults", tagResults);
        this.state.set("brandSearchResult", brands);

        // TODO: Do we need this?
        this.state.set("accountSearchResults", "");
        this.state.set("orderSearchResults", "");
      }

      /*
       * Account Search
       */
      if (searchCollection === "accounts") {
        const accountResults = AccountSearch.find().fetch();
        const accountResultsCount = accountResults.length;
        this.state.set("accountSearchResults", accountResults);
        this.state.set("accountSearchCount", accountResultsCount);

        // TODO: Do we need this?
        this.state.set("orderSearchResults", "");
        this.state.set("productSearchResults", "");
        this.state.set("tagSearchResults", "");
        this.state.set("suggestionSearchResults", "");
      }

      /*
       * Order Search
       */
      if (searchCollection === "orders") {
        const orderResults = OrderSearch.find().fetch();
        const orderResultsCount = orderResults.length;
        this.state.set("orderSearchResults", orderResults);
        this.state.set("orderSearchCount", orderResultsCount);


        // TODO: Do we need this?
        this.state.set("accountSearchResults", "");
        this.state.set("productSearchResults", "");
        this.state.set("tagSearchResults", "");
        this.state.set("suggestionSearchResults", "");
      }
    }
  });
});


/*
 * searchModal helpers
 */
Template.searchModal.helpers({
  IconButtonComponent() {
    const instance = Template.instance();
    const view = instance.view;

    return {
      component: IconButton,
      icon: "fa fa-times",
      kind: "close",
      onClick() {
        $(".js-search-modal").fadeOut(400, () => {
          $("body").css("overflow", "visible");
          Blaze.remove(view);
        });
      }
    };
  },
  productSearchResults() {
    const instance = Template.instance();
    const results = instance.state.get("productSearchResults");
    return results;
  },
  tagSearchResults() {
    const instance = Template.instance();
    const results = instance.state.get("tagSearchResults");
    return results;
  },
  priceOptions() {
    return [
      { value: "null", label: "Filter by price" },
      { value: "all", label: "All prices" },
      { value: "below-10", label: "below - $10" },
      { value: "10-55", label: "$10 - $55" },
      { value: "55-100", label: "$55 - $100" },
      { value: "100-500", label: "$100 - $500" },
      { value: "500-1000", label: "$500 - $1000" },
      { value: "1000-above", label: "$1000 - above" }
    ];
  },
  brands() {
    const instance = Template.instance();
    const brands = instance.state.get("brandSearchResult");
    if (brands) {
      let results = [{
        value: "&null&",
        label: "Filter by brand"
      },
        {
          value: "&all&",
          label: "All brands"
        }
      ];
      for (let brand = 0; brand < brands.length; brand++) {
        results.push({
          value: brands[brand],
          label: brands[brand]
        });
      }

      return results;
    }
  },
  bestSellers() {
    return [
      { value: "one", label: "Filter by seller" },
      { value: "two", label: "Highest-Lowest" },
      { value: "two", label: "Lowest-Highest" }
    ];
  },
  brandSelect() {
    const instance = Template.instance();
    const brandPicked = Session.get("pickedBrand");
    if (typeof brandPicked === "string") {
      instance.state.set("brandPicked", brandPicked);
    }
  },
  priceSelect() {
    const instance = Template.instance();
    const priceRange = Session.get("pickedOption");
    if (priceRange) {
      instance.state.set("priceRange", priceRange);
    }
  },
  bestSellerSelect() {
    const instance = Template.instance();
    const sellerPicked = Session.get("sellerPicked");
    if (typeof sellerPicked === "string") {
      instance.state.set("bestSellers", sellerPicked);
    }
  },
  suggestionSearchResults() {
    const instance = Template.instance();
    return instance.state.get("suggestionSearchResults");
  },
  showSearchResults() {
    return false;
  }
});


/*
 * searchModal events
 */
Template.searchModal.events({
  // on type, reload Reaction.SaerchResults
  "keyup input": (event, templateInstance) => {
    event.preventDefault();
    const searchQuery = templateInstance.find("#search-input").value;
    templateInstance.state.set("searchQuery", searchQuery);
    $(".search-modal-header:not(.active-search)").addClass(".active-search");
    if (!$(".search-modal-header").hasClass("active-search")) {
      $(".search-modal-header").addClass("active-search");
    }
  },
  "click [data-event-action=filterByTag]": function (event, templateInstance) {
    event.preventDefault();
    const instance = Template.instance();
    const facets = instance.state.get("facets") || [];
    const newFacet = $(event.target).data("event-value");

    tagToggle(facets, newFacet);

    $(event.target).toggleClass("active-tag btn-active");

    templateInstance.state.set("facets", facets);
  },
  "click [data-event-action=filterByPrice]": function (event, templateInstance) {
    event.preventDefault();
    const instance = Template.instance();
    const facets = instance.state.get("facets") || [];
    const newFacet = $(event.target).data("event-value");

    tagToggle(facets, newFacet);

    $(event.target).toggleClass("active-tag btn-active");

    templateInstance.state.set("facets", facets);
  },
  "click [data-event-action=filterByBrand]": function (event, templateInstance) {
    event.preventDefault();
    const instance = Template.instance();
    const facets = instance.state.get("facets") || [];
    const newFacet = $(event.target).data("event-value");

    tagToggle(facets, newFacet);

    $(event.target).toggleClass("active-tag btn-active");

    templateInstance.state.set("facets", facets);
  },
  "click [data-event-action=productClick]": function () {
    const instance = Template.instance();
    const view = instance.view;
    $(".js-search-modal").delay(400).fadeOut(400, () => {
      Blaze.remove(view);
    });
  },
  "click [data-event-action=clearSearch]": function (event, templateInstance) {
    $("#search-input").val("");
    $("#search-input").focus();
    const searchQuery = templateInstance.find("#search-input").value;
    templateInstance.state.set("searchQuery", searchQuery);
  },
  "click [data-event-action=searchCollection]": function (event, templateInstance) {
    event.preventDefault();
    const searchCollection = $(event.target).data("event-value");

    $(".search-type-option").not(event.target).removeClass("search-type-active");
    $(event.target).addClass("search-type-active");

    $("#search-input").focus();

    templateInstance.state.set("searchCollection", searchCollection);
  }
});


/*
 * searchModal onDestroyed
 */
Template.searchModal.onDestroyed(() => {
  // Kill Allow modal to be closed by clicking ESC, which was initiated in Template.searchModal.onCreated
  $(document).off("keyup");
});
