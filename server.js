var express = require("express")
  , app = express.createServer();

app.configure(function(){
  app.use(express.logger());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.favicon("./favicon.ico"));
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  app.use("/app", express.static("./app"));
  app.use("/dist", express.static("./dist"));
  app.use("/assets", express.static("./assets"));
  app.use(app.router);
});

app.set("views", "./app/templates");
app.set('view options', {
  pretty: true,
  layout: false
});

// Ensure all routes go home, client side app..
app.get("/", function(req, res) {
  // fs.createReadStream(options.index).pipe(res);
  res.render("index.jade");
});

// Actually listen
app.listen(8000, "127.0.0.1");
