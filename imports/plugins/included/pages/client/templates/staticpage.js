import { StaticPages } from "/lib/collections";

Template.staticPage.onCreated(function () {
  // Subscribe to Pages publication
  this.subscribe("Pages");
});

Template.staticPage.events({
  // Submit Page
  "submit .new_page"(event) {
    event.preventDefault();

    // Gets form values
    const target = event.target;
    const name = target.name.value;
    const title = target.title.value;
    const body = target.body.value;
    const btnAction = document.getElementById("btn-update").innerHTML;

    if (btnAction === "Create Page") {
      // Call the insert method
      Meteor.call("pages.insert", name, title, body);
    } else {
      // Call update method
      Meteor.call("pages.update", currentPage, name, title, body);
      // Reset button state
      document.getElementById("btn-update").innerHTML = "Create Page";
    }
    // Empty form after submission
    target.name.value = "";
    target.title.value = "";
    CKEDITOR.instances.body.setData("");
  },

  // Edit that page
  "click .edit"(event) {
    // Prevent browser default
    event.preventDefault();

    // Update form values with page data
    document.getElementById("name").value = this.pageName;
    document.getElementById("title").value = this.pageTitle;
    CKEDITOR.instances.body.setData(this.pageBody);

    // Change button state
    document.getElementById("btn-update").innerHTML = "Update";

    currentPage = this._id;
  },

  // Delete page
  "click .delete"() {
    Meteor.call("pages.delete", this._id);
  }
});

Template.staticPage.helpers({
  // Makes StaticPages data available to the template
  displayPages() {
    return StaticPages.find();
  }
});
