const jwt = require("jsonwebtoken");

const protectRoute = (req, res, next) => {
  try {
    if (!req.cookies.token) {
      throw new Error("You are not authorized!");
    }
    req.user = jwt.verify(req.cookies.token, process.env.JWT_SECRET_KEY);
    next();
  } catch (err) {
    err.statusCode = 401;
    next(err);
  }
};

const createJWTToken = (userId, username) => {
  const payload = { userId, username };
  const token = jwt.sign(payload, process.env.JWT_SECRET_KEY);
  return token;
};

module.exports = { protectRoute, createJWTToken };