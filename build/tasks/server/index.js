// ============================================================================
// TASKS
// ============================================================================

task.registerTask("server", "Run development server.", function(prop) {
 var props = ["server"];
  // If a prop was passed as the argument, use that sub-property of server.
  if (prop) { props.push(prop); }

  var options = config(props) || {};

  // Defaults set for server values
  var options = underscore.defaults(options, {
    favicon: "./favicon.ico",
    index: "./index.html",

    port: 8000,
    host: "127.0.0.1"
  });

  options.paths = options.paths || {};

  // Ensure paths have correct defaults
  options.paths = underscore.defaults(options.paths, {
    app: "./app",
    assets: "./assets",
    dist: "./dist"
  });

  // Run the server
  task.helper("server", options);

  // Fail task if errors were logged
  if (task.hadErrors()) { return false; }

  log.writeln("Listening on http://" + options.host + ":" + options.port);
});

// ============================================================================
// HELPERS
// ============================================================================

task.registerHelper("server", function(options) {
  // Require libraries
  var fs = require("fs");
  var express = require("express");
  var app = express.createServer();

  app.configure(function(){
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
    app.use(app.router);
  });

  app.set("views", "./");
  app.set('view options', {
    layout: false
  });

  // Serve static files from folders
  Object.keys(options.paths).sort().reverse().forEach(function(key) {
    app.use("/" + key, express.static(options.paths[key]));
  });

  // Serve favicon.ico
  app.use(express.favicon(options.favicon));

  // Ensure all routes go home, client side app..
  app.get("*", function(req, res) {
    // fs.createReadStream(options.index).pipe(res);
    res.render("index.jade");
  });

  // Actually listen
  app.listen(options.port, options.host);
});
