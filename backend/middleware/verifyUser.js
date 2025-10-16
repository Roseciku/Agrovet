const jwt = require("jsonwebtoken");

// ✅ Verify any logged-in user (Access Token from headers)
exports.verifyUser = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ message: "Unauthorized - No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded; // { user_id, email, role }
    next();
  } catch (err) {
    return res.status(403).json({ message: "Forbidden - Invalid or expired access token" });
  }
};

// ✅ Verify admin only
exports.verifyAdmin = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized - No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Forbidden - Admins only" });
    }

    req.user = decoded; // { user_id, email, role }
    next();
  } catch (err) {
    return res.status(403).json({ message: "Forbidden - Invalid or expired access token" });
  }
};
