/*jshint laxbreak:true */
define("archiv", [
  "jquery",
  "use!underscore",
  "use!backbone"
],

function($, _, Backbone) {
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
    var html = this.template(data || this.model.attributes)
      , $el = this.$el || $('<div>');

    $el[0] = html;
    this.el = html;
    this.$el = $el;

    return this;
  };

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
  "modules/menu"
],

function (archiv, jQuery, Backbone, Menu) {
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
        ":hash": "index"
      },

      index: function(hash) {
        var route = this
          , menu = new Menu.MenuView({
            collection: new Menu.Menu([
              new Menu.Entry({name: 'Wirtschaft', href: 'wirtschaft'}),
              new Menu.Entry({name: 'Schweiz', href: 'schweiz'}),
              new Menu.Entry({name: 'Politik', href: 'politik'}),
              new Menu.Entry({name: 'International', href: 'international'})
            ])
          });

        menu.render();

        // Fix for hashes in pushState and hash fragment
        if (hash && !route._alreadyTriggered) {
          // Reset to home, pushState support automatically converts hashes
          Backbone.history.navigate("", false);

          // Trigger the default browser behavior
          location.hash = hash;

          // Set an internal flag to stop recursive looping
          route._alreadyTriggered = true;
        }
      }
    });

    // Define your master router on the application namespace and trigger all
    // navigation from this instance.
    app.router = new MainRouter();

    // Trigger the initial route and enable HTML5 History API support
    Backbone.history.start({ pushState: true });

    // All navigation that is relative should be passed through the navigate
    // method, to be processed by the router.  If the link has a data-bypass
    // attribute, bypass the delegation completely.
    $(document).on("click", "a:not([data-bypass])", function(evt) {
      // Get the anchor href and protcol
      var href = this.href;
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
