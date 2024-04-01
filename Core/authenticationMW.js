const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {
  try {
    let token = req.get("authorization").split(" ")[1];
  let decoded_token = jwt.verify(token,process.env.SECRET_KEY);
  // console.log(decoded_token);
    req.token = decoded_token;
    next();
  } catch (error) {
    error.message = "not Athenticated";
    next(error);
  }
};

module.exports.isAdmin = (req, res, next) => {
  console.log("Token:", req.token);
  if (req.token.role == "admin") {
      console.log(req.token._id + " is admin");
      next();
  } else {
      console.log(req.token.role + " is not an admin");
      next(new Error("Unauthorized"));
  }
};


module.exports.isteacher = (req, res, next) => {
  if (req.token.role == "teacher") next();
  else next(new Error("not Authorizatied"));
};