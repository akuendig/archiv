/*jshint laxbreak:true */
define([
  "archiv",
  "jquery",
  "use!underscore",
  "use!backbone"
],

function(archiv, $, _, Backbone) {
  var Tagi = archiv.namespace(),
    , app = archiv.app;

  Tagi.Router = Backbone.Router.extend({
    routes: {
      "tagi": "index",
      "tagi/:id": "article",
      "tagi/category/:category", "category"
    },

    index: function () {
      app.trigger
    },
  });
}
