const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const hbs = require("express-handlebars");
const bodyParser = require("body-parser");

const { route } = require("./routes/index");
const { chat } = require("./chats/index");
const { sessionConfig, serveStatic, hbsConfig } = require("./app_config");

const app = express();
const http = require("http").createServer(app);

const io = require("socket.io")(http);

const PORT = process.env.PORT || 9000;
/**
 * allowing request as per given headers docs { test }
 */
app.use((req, res, next) => {
  res.set({
    "access-control-allow-origin":
      "Origin, X-Requested-With, Content-Type, Accept",
    "access-control-allow-methods": "GET, POST, PUT",
    "access-control-allow-origin": "*",
    server: "cloudflare-nginx"
  });
  next();
});

app.use(session(sessionConfig));

app.set("view engine", "hbs");

app.engine("hbs", hbs(hbsConfig));

app.use("/static", express.static(serveStatic));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use(cookieParser());

/**
 * routing functions in route module
 */
app.use(route);

new chat(io);

http.listen(PORT, () => {
  console.log("server is running on port : ", PORT);
});
