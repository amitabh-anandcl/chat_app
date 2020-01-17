const path = require("path");
require("dotenv").config({
  path: path.join(__dirname, ".env")
});

const sessionConfig = {
  secret: process.env.EXP_KEY + Date.now(),
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false
  }
};

const hbsConfig = {
  extname: "hbs",
  defaultView: "default",
  layoutsDir: path.join(__dirname, "views", "layouts"),
  partialsDir: path.join(__dirname, "views", "partials")
};
const serveStatic = path.join(__dirname, "assets");

module.exports = {
  sessionConfig,
  serveStatic,
  hbsConfig
};
