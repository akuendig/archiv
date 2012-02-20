/*jshint laxbreak:true */
define([
  "archiv",
  "jquery",
  "use!underscore",
  "use!backbone",
  "jade!templates/category",
  "jade!templates/category-entry"
],

function(archiv, $, _, Backbone, categoryTemplate, entryTemplate) {

  // Create a new module
  var Category = archiv.module();

  Category.Entry = Backbone.Model.extend({
    defaults: {
      title: 'Default Title',
      summaery: 'This is a small default summary of an article.'
    }
  });

  Category.EntryView = Backbone.View.extend({
    template: entryTemplate,

    render: function ( event ) {
      return this.renderTemplate();
    }
  });

  Category.Categories = Backbone.Collection.extend({
    model: Category.Entry
  });

  Category.CategoryView = Backbone.View.extend({
    el: $('#content'),

    template: categoryTemplate,

    render: function ( event ) {
      var html = this.template()
        , container;

      this.el.html(html);
      container = $('#article-list');

      this.collection.each(function (model) {
        var view = new Category.EntryView({
          model: model
        });

        view
          .render()
          .start()
          .el
            .data('view', view)
            .appendTo(container);
      });
    }
  });

  return Category;
});
