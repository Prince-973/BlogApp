const { validateToken } = require("../sevice/auth");
function checkForAuthenticationCookie(cookieName) {
  return (req, res, next) => {
    const tokenCookieValue = req.cookies?.[cookieName];
    if (!tokenCookieValue) {
      return next();
    }

    try {
      const userPayLoad = validateToken(tokenCookieValue);
      req.user = userPayLoad;
    } catch (error) {
      return next(); // Early exit if there's an error in token validation
    }
    return next();
  };
}

module.exports = {
  checkForAuthenticationCookie,
};
