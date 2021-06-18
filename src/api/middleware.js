
const path = require('path')

// Middleware to expose the app's shared templates to the client-side of the app
// for pages which need them.
function exposeTemplates (options) {
  return function exposeTemplates(req, res, next) {
    // Uses the `ExpressHandlebars` instance to get the get the **precompiled**
    // templates which will be shared with the client-side of the app.
    options.hbs.getTemplates(path.join(__dirname, "../ui/views/partials/shared/"), {
      cache: options.app.enabled("view cache"),
      precompiled: true,
    }).then(function (templates) {
      // RegExp to remove the ".handlebars" extension from the template names.
      const extRegex = new RegExp(options.hbs.extname + "$");

      // Creates an array of templates which are exposed via
      // `res.locals.templates`.
      templates = Object.keys(templates).map(function (name) {
        return {
          name: name.replace(extRegex, ""),
          template: templates[name],
        };
      });

      // Exposes the templates during view rendering.
      if (templates.length) {
        res.locals.templates = templates;
        res.locals.partials = templates;
      }

      setImmediate(next);
    })
      .catch(next);
  }
}

exports.exposeTemplates = exposeTemplates
