// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

exports.authenticateUser = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("🔐 Incoming Auth Header:", authHeader); // ADD THIS

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log("❌ No token provided");
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Token decoded successfully:", decoded); // ADD THIS
   req.user = { id: decoded.id };

    next();
  } catch (err) {
    console.log("❌ Invalid token:", err.message); // ADD THIS
    res.status(401).json({ message: 'Invalid token' });
  }
};
