import { Reaction } from "/server/api";

Reaction.registerPackage({
  label: "Pages",
  name: "static-pages",
  icon: "fa fa-file-powerpoint-o",
  autoEnable: true,
  settings: {
    name: "Pages"
  },
  registry: [{
    route: "/dashboard/pages",
    provides: "dashboard",
    workflow: "corePagesWorkFlow",
    name: "Static Pages",
    label: "Pages",
    description: "Create and Manage Static Pages",
    icon: "fa fa-file-powerpoint-o",
    priority: 1,
    container: "core",
    template: "staticPage"
  }],
  layout: [{
    layout: "coreLayout",
    workflow: "corePagesWorkFlow",
    theme: "default",
    enabled: true,
    structure: {
      template: "staticPage",
      layoutHeader: "layoutHeader",
      layoutFooter: "layoutFooter",
      notFound: "notFound",
      dashboardHeader: "dashboardHeader",
      dashboardControls: "dashboardControls",
      adminControlsFooter: "adminControlsFooter"
    }
  }]
});
