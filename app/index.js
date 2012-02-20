/*jshint laxbreak:true */
define("archiv", [
  "jquery",
  "use!underscore",
  "use!backbone"
],

function($, _, Backbone) {
  var app = _.extend({}, Backbone.Event);

  app.Const = {
    CategoryListReset: "category:list:reset",
    ArticleReset: "article:reset"
  };

  Backbone.View.prototype.start = function() {
    if (this.model && this.modelEvents) {
        _.each(
          this.modelEvents,
          function(functionName, event) {
            this.model.bind(event, this[functionName]);
          },
          this);
    }

    return this;
  };

  Backbone.View.prototype.stop = function() {
    if (this.model && this.modelEvents) {
        _.each(
          this.modelEvents,
          function(functionName, event) {
            this.model.unbind(event, this[functionName]);
          },
          this);
    }

    this.remove();
    this.unbind();

    return this;
  };

  Backbone.View.prototype.renderTemplate = function (data) {
    var html = this.template(data || this.model.attributes);

    this.el = $(html);

    return this;
  };

  $.single=function(a) {
    return function(b) {
      a[0] = b;
      return a;
    };
  }($([1]));

  return {
    // Create a custom object with a nested Views object
    module: function(additionalProps) {
      return _.extend({ Views: {}, Models: {} }, additionalProps);
    },

    // Keep active application instances namespaced under an app object.
    app: _.extend({}, Backbone.Events)
  };
});

require([
  "archiv",
  "jquery",
  "use!backbone",
  "modules/sidebar",
  "modules/category"
],

function (archiv, jQuery, Backbone, Sidebar, Category) {
  // Treat the jQuery ready function as the entry point to the application.
  // Inside this function, kick-off all initialization, everything up to this
  // point should be definitions.
  jQuery(function($) {

    // Shorthand the application namespace
    var app = archiv.app;

    // Defining the application router, you can attach sub routers here.
    var MainRouter = Backbone.Router.extend({
      routes: {
        "": "index",
        ":hash": "index",
        "about/": "about",
        "contact": "contact",
        "category/:cat": "category"
      },

      index: function(hash) {
        var route = this;

        // Fix for hashes in pushState and hash fragment
        if (!route._initialized) {
          this.initializeView();

          // Reset to home, pushState support automatically converts hashes
          Backbone.history.navigate("", true);

          // Trigger the default browser behavior
          location.hash = hash || "";

          // Set an internal flag to stop recursive looping
          route._initialized = true;
        }
      },

      initializeView: function () {
        var sidebar = new Sidebar.SidebarView({
              collection: new Sidebar.Sidebar([
                new Sidebar.Entry({name: 'Wirtschaft', href: 'category/wirtschaft'}),
                new Sidebar.Entry({name: 'Schweiz', href: 'category/schweiz'}),
                new Sidebar.Entry({name: 'Politik', href: 'category/politik'}),
                new Sidebar.Entry({name: 'International', href: 'category/international'})
              ])
            })
          , categoryView = new Category.CategoryView({
              collection: new Category.Categories([
                new Category.Entry({title: 'Title 1', summary: 'Summary 1'}),
                new Category.Entry({title: 'Title 2', summary: 'Summary 2'}),
                new Category.Entry({title: 'Title 3', summary: 'Summary 3'}),
                new Category.Entry({title: 'Title 4', summary: 'Summary 4'})
              ])
            });

        sidebar.render();
        categoryView.render();

      },

      contact: function ( event ) {
        this.index();
      },

      category: function ( event ) {
        this.index();
      },

      about: function () {
        this.index();
      }
    });

    // Define your master router on the application namespace and trigger all
    // navigation from this instance.
    app.router = new MainRouter();

    // Trigger the initial route and enable HTML5 History API support
    Backbone.history.start({ pushState: false });

    // All navigation that is relative should be passed through the navigate
    // method, to be processed by the router.  If the link has a data-bypass
    // attribute, bypass the delegation completely.
    $(document).on("click", "a:not([data-bypass])", function(evt) {
      // Get the anchor href and protcol
      var href = this.getAttribute("href");
      var protocol = this.protocol + "//";

      // Ensure the protocol is not part of URL, meaning its relative.
      if (href.slice(0, protocol.length) !== protocol) {
        // Stop the default event to ensure the link will not cause a page
        // refresh.
        evt.preventDefault();

        // This uses the default router defined above, and not any routers
        // that may be placed in modules.  To have this work globally (at the
        // cost of losing all route events) you can change the following line
        // to: Backbone.history.navigate(href, true);
        app.router.navigate(href, true);
      }
    });

  });
});
