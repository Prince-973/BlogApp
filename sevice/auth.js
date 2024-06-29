const jwt = require("jsonwebtoken");
const secret = "Prince@123";

function createTokenForuser(user) {
  const payload = {
    _id: user._id,
    fullName: user.fullName,
    email: user.email,
    profileImageUrl: user.profileImageUrl,
    role: user.role,
  };
  const token = jwt.sign(payload, secret);
  return token;
}

function validateToken(token) {
  try {
    const payload = jwt.verify(token, secret);
    return payload;
  } catch (error) {
    console.error("Token validation error:", error);
    throw new Error("Invalid or expired token");
  }
}

module.exports = {
  createTokenForuser,
  validateToken,
};
