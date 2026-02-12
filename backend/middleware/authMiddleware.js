const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  console.log("AUTH HEADER:", req.headers.authorization);

  const authHeader = req.headers.authorization;

  if (!authHeader) {
    console.log("❌ No auth header");
    return res.status(401).json({ message: "No auth header" });
  }

  if (!authHeader.startsWith("Bearer ")) {
    console.log("❌ Wrong auth format");
    return res.status(401).json({ message: "Invalid auth format" });
  }

  const token = authHeader.split(" ")[1];
  console.log("TOKEN RECEIVED:", token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("DECODED TOKEN:", decoded);

    req.user = decoded;
    next();
  } catch (error) {
    console.log("❌ JWT ERROR:", error.message);
    return res.status(401).json({ message: "Invalid token" });
  }
};
