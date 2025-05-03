const jwt = require('jsonwebtoken');

const verifyToken = async (req, res, next) => {
  let token = req.headers.authorization;

  if (!token || !token.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    token = token.split(" ")[1]; // Remove 'Bearer '
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded._id; // Attach user ID to request
    next();
  } catch (err) {
    console.error('JWT Error:', err.message);
    return res.status(401).json({ message: "Not authorized, invalid token" });
  }
};

module.exports = verifyToken;