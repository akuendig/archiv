// This is the main Backbone Boilerplate build configuration file.

// Custom function to read in require.config settings
function readRequireConfig(path) {
  var _require = require;
  var obj;
  var config = require("fs").readFileSync(path).toString();

  // Patch over require since jshint complains about using with...
  require = {
    config: function(_obj) {
      obj = _obj;
    }
  };

  // Yes I know what this is doing...
  eval(config);

  // Restore require
  require = _require;

  return obj || {};
}

// This is a JavaScript file, you can define any functions you would like in
// here.
config.init({

  clean: {
    folder: "dist/"
  },

  jst: {
    "dist/debug/js/templates.js": ["app/templates/*.html"]
  },

  lint: {
    files: ["build/config.js", "app/**/*.js"]
  },

  jshint: {
    options: {
      evil: true
    }
  },

  watch: {
    files: ["app/**/*", "assets/**/*"],
    tasks: "lint:files requirejs",
    
    min: {
      files: "<watch:files>",
      tasks: "default min mincss"
    }
  },

  mincss: {
    "dist/release/style.css": ["assets/css/**/*.css"]
  },

  min: {
    "dist/release/index.js": ["dist/debug/index.js"],
    "dist/release/require.js": ["assets/js/libs/require.js"]
  },

  server: {
    debug: {
      paths: {
        "app": "dist/debug",
        "app/templates": "app/templates"
      }
    },

    release: {
      paths: {
        "app": "dist/release",
        "app/templates": "app/templates",
        "assets/js/libs": "dist/release",
        "assets/css": "dist/release"
      }
    }
  },

  requirejs: readRequireConfig("app/config.js")

});

// Run the following tasks...
task.registerTask("default", "clean lint requirejs");
