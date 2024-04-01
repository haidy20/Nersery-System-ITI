const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {
  try {
    let token = req.get("authorization").split(" ")[1];
  let decoded_token = jwt.verify(token, "Nursery System");
  console.log(decoded_token);
    req.token = decoded_token;
    next();
  } catch (error) {
    error.message = "not Athenticated";
    next(error);
  }
};

module.exports.isAdmin = (req, res, next) => {
  console.log(req.token.role);
  if (req.token.role == "admin") next();
  else next(new Error("admin not Authorized"));
};

module.exports.isteacher = (req, res, next) => {
  if (req.token.role == "teacher") next();
  else next(new Error("teacher not Authorized"));
};