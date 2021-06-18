
"use strict";

const Promise = global.Promise || require("promise");

const path = require('path')
const express = require("express");
const exphbs  = require('express-handlebars')
const helpers = require(path.join(__dirname, "../ui/view-helpers/helpers"))
const routes = require(path.join(__dirname, './routes'))
const sockets = require(path.join(__dirname, './sockets'))

const app = express();
const http = require('http').Server(app)
const io = require('socket.io')(http)

if (process.env.NODE_ENV !== 'production') {
  const livereload = require('livereload')
  const connectLiveReload = require('connect-livereload')

  const liveReloadServer = livereload.createServer({
    exts: ['handlebars', 'css']
  })
  liveReloadServer.watch(path.join(__dirname, '../ui/views'))
  liveReloadServer.watch(path.join(__dirname, '../ui/public'))

  app.use(connectLiveReload())
}

// Create `ExpressHandlebars` instance with a default layout.
const hbs = exphbs.create({
  helpers,
  partialsDir: [
    path.join(__dirname, "../ui/views/partials/"),
  ],
});

// Register `hbs` as our view engine using its bound `engine()` function.
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.set('views', path.join(__dirname, '../ui/views'))

app.use(express.static(path.join(__dirname, "../ui/public/")));

routes.load({app, hbs})
io.on('connection', sockets.onConnection)

http.listen(3000, function () {
  console.log("express-handlebars example server listening on: 3000");
});
