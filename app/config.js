// Set the require.js configuration for your application.
require.config({
  paths: {
    // JavaScript folders
    libs: "/assets/js/libs",
    plugins: "/assets/js/plugins",

    // Libraries
    jquery: "/assets/js/libs/jquery",
    underscore: "/assets/js/libs/underscore",
    backbone: "/assets/js/libs/backbone",

    // Shim Plugin
    use: "/assets/js/plugins/use",
    depend: "/assets/js/plugins/depend",
    jade: "/assets/js/plugins/jade",
    order: "/assets/js/plugins/order",
    text: "/assets/js/plugins/text"
  },

  use: {
    backbone: {
      deps: ["use!underscore", "jquery"],
      attach: "Backbone"
    },

    underscore: {
      attach: "_"
    }
  }
});
