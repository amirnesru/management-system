const jwt = require("jsonwebtoken");

const generateToken = (userId, role, rememberMe = false) => {
  const expiresIn = rememberMe ? "30d" : "1h";

  return jwt.sign(
    {
      userId,
      role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn,
    }
  );
};

module.exports = generateToken;