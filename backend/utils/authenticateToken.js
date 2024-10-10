const jwt = require("jsonwebtoken");

// Middleware to validate JWT token
const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Getting the token from the Authorization header

  if (!token) {
    return res.send({
      message: "Unauthorized",
      status: 401,
    }); // Unauthorized if no token is sent
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403); // Forbidden if token is invalid
    }

    req.user = user; // Save the user information in request object for later use
    next(); // Call the next middleware or route handler
  });
};

module.exports = authenticateToken;
