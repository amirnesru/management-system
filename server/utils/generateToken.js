const jwt = require("jsonwebtoken");

const expiresIn = rememberMe ? "30d" : "1h";

const token = jwt.sign(
  { id: user._id },
  process.env.JWT_SECRET,
  { expiresIn }
);

module.exports = generateToken;