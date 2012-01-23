/*jshint laxbreak:true */
define([
  "archiv",
  "jquery",
  "use!underscore",
  "use!backbone",
  "jade!templates/menuEntry"
],

function(archiv, $, _, Backbone, template) {

  // Create a new module
  var Menu = archiv.module();

  Menu.Entry = Backbone.Model.extend({
    defaults : {
      name: 'Unset Title',
      href: 'error/defaultMenuLink'
    }
  });

  Menu.EntryView = Backbone.View.extend({
    template: template,

    initialize: function () {
      _.bindAll(this, 'select', 'unselect');
    },

    events: {
      'click': 'select'
    },

    select: function ( event ) {
      var $el = this.$el;

      if ($el) {
        $el.addClass('active');
      }

      archiv.app.trigger('menu:select', this);
      return this;
    },

    unselect: function ( event ) {
      if ($el) {
        $el.removeClass('active');
      }

      archiv.app.trigger('menu:unselect', this);
      return this;
    },

    render: function ( event ) {
      this.renderTemplate();
      return this;
    }
  });

  Menu.Menu = Backbone.Collection.extend({
    model: Menu.Entry
  });

  Menu.MenuView = Backbone.View.extend({
    el: $('#categories'),

    initialize: function () {
      this.render();
    },

    render: function () {
      var $el = this.$el || $(this.el);
      this.$el = $el;

      $el.
        find('li').
        not('.nav-header').
        each(function () {
          $.data(this, 'view').stop();
        });

      this.collection.each(function (entry) {
        var view = new Menu.EntryView({
          model: entry
        });

        view.
          start().
          render().
          $el.
            appendTo($el).
            data('view', view);

      });

      return this;
    }
  });

  // Required, return the module for AMD compliance
  return Menu;

});
