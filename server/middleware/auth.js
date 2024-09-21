import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) return res.status(401).json({ message: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token,"bixmonk"); // Use your secret
    console.log("Decoded token:", decoded); // Log to check token data
    req.user = { _id: decoded.user_id }; // Use user_id from the token
    next();
  } catch (err) {
    console.error("Token validation failed:", err);
    res.status(401).json({ message: "Token is not valid" });
  }
};
