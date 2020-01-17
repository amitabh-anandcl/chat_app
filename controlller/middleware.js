const jwt = require("jsonwebtoken");

let check_session = (req, res, next) => {
  create_session(req, res, next);
};

let create_session = (req, res, next) => {
  req.session.user = {
    name: req.body.name,
    email: req.body.email
  };
  create_jwt_cookie(req, res, next);
};

let create_jwt_cookie = (req, res, next) => {
  req.session.cookie_ = {
    key: jwt.sign(req.session.user, process.env.JWT_KEY)
  };
  next();
};

let session_ = (req, res, next) => {
  if (req.cookies && req.session.user) {
    next();
  } else {
    res.redirect("/");
  }
};

let verify_jwt = token => {
  return jwt.verify(token, process.env.JWT_KEY);
};

module.exports = {
  check_session,
  create_session,
  create_jwt_cookie,
  session_,
  verify_jwt
};
