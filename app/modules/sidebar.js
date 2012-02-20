/*jshint laxbreak:true */
define([
  "archiv",
  "jquery",
  "use!underscore",
  "use!backbone",
  "jade!templates/sidebar-entry"
],

function(archiv, $, _, Backbone, template) {

  // Create a new module
  var Sidebar = archiv.module();

  Sidebar.Entry = Backbone.Model.extend({
    defaults : {
      name: 'Unset Title',
      href: 'error/defaultSidebarLink'
    }
  });

  Sidebar.EntryView = Backbone.View.extend({
    template: template,

    initialize: function () {
      _.bindAll(this, 'select', 'unselect');
    },

    events: {
      'click': 'select'
    },

    select: function ( event ) {
      var $el = this.el;

      if ($el) {
        $el.addClass('active');
      }

      archiv.app.trigger('sidebar:select', this);
      return this;
    },

    unselect: function ( event ) {
      var $el = this.el;

      if ($el) {
        $el.removeClass('active');
      }

      archiv.app.trigger('sidebar:unselect', this);
      return this;
    },

    render: function ( event ) {
      return this.renderTemplate();
    }
  });

  Sidebar.Sidebar = Backbone.Collection.extend({
    model: Sidebar.Entry
  });

  Sidebar.SidebarView = Backbone.View.extend({
    el: $('#categories'),

    render: function () {
      var $el = this.el;

      $el
        .find('li')
        .not('.nav-header')
        .each(function () {
          $.data(this, 'view').stop();
        });

      this.collection.each(function (entry) {
        var view = new Sidebar.EntryView({
          model: entry
        });

        view
          .start()
          .render()
          .el
            .appendTo($el)
            .data('view', view);
      });

      return this;
    }
  });

  // Required, return the module for AMD compliance
  return Sidebar;

});
