define([
  "archiv",
  "jquery",
  "use!underscore",
  "use!backbone",
  "text!templates/example.html"
],

function(archiv, $, _, Backbone, template) {

  // Create a new module
  var Example = archiv.module();

  // Example extendings
  Example.Model = Backbone.Model.extend({ /* ... */ });
  Example.Collection = Backbone.Collection.extend({ /* ... */ });
  Example.Router = Backbone.Router.extend({ /* ... */ });

  // This will fetch the tutorial template and render it.
  Example.Views.Tutorial = Backbone.View.extend({
    id: "main",

    render: function() {
      var compiled = this.compiled = this.compiled || _.template(template)
        , test = compiled();
      $("#main").html(compiled());
      return this;
    }
  });

  // Required, return the module for AMD compliance
  return Example;

});
