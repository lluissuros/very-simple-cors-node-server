const jwt = require("jsonwebtoken");
const exjwt = require("express-jwt");
const config = require("config");

/*========= Here we will set up an express jsonwebtoken middleware(simply required for express to properly utilize the token for requests) 
You MUST instantiate this with the same secret that the client ============*/
const jwtMWChecker = exjwt({
  secret: config.get("secret_key"),
  getToken: function fromHeaderOrQuerystring(req) {
    if (
      req.headers.authorization &&
      req.headers.authorization.split(" ")[0] === "Bearer"
    ) {
      return req.headers.authorization.split(" ")[1];
    } else if (req.query && req.query.token) {
      return req.query.token;
    }
    return null;
  }
});

module.exports = jwtMWChecker;
