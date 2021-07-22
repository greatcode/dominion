
const path = require('path')
const middleware = require(path.join(__dirname, './middleware'))

function home(req, res) {
  res.render("home", {
    title: "Home",
  });
}

function yell(req, res) {
  res.render("yell", {
    title: "Yell",

    // This `message` will be transformed by our `yell()` helper.
    message: "hello world",
  });
}

function exclaim(req, res) {
  res.render("yell", {
    title: "Exclaim",
    message: "hello world",

    // This overrides _only_ the default `yell()` helper.
    helpers: {
      yell (msg) {
        return (msg + "!!!");
      },
    },
  });
}

function echoMessage(req, res) {
  res.render("echo", {
    title: "Echo",
    message: req.params.message
  });
}

function gameHome(req, res) {
  res.render("game_home", {});
}

function startGame(req, res) {
  res.render('start_game')
}

function load(options) {
  const { app, hbs } = options

  app.get("/", home);
  app.get("/yell", yell);
  app.get("/exclaim", exclaim);
  app.get("/echo/:message?", middleware.exposeTemplates({app, hbs}), echoMessage);
  app.get("/game_home/", gameHome);
  app.get("/start_game/:gameid?", startGame);
}

exports.load = load
