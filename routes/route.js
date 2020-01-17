const express = require("express");
const router = express.Router();

const { check_session, session_ } = require("../controlller/index");

router.get("/", (req, res, next) => {
  res.render("pages/home", { title: "home" });
});

router.post("/login", check_session, (req, res) => {
  res.cookie("jwt_key", req.session.cookie_.key).redirect("/chat");
});

router.get("/chat", session_, (req, res) => {
  res.render("pages/chat", { title: "chat" });
});

router.get("/logout", (req, res, next) => {
  req.session.destroy(() => {
    res.clearCookie("jwt_key").redirect("/");
  });
});

router.all("*", (req, res, next) => {
  res.redirect("/");
});

const route = router;

module.exports = {
  route
};
