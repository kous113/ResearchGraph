
import jwt from "jsonwebtoken";

export default function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;

  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Authentication required."
    });
  }

  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET is missing from environment variables.");

    return res.status(500).json({
      success: false,
      message: "Authentication configuration error."
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      id: decoded.userId,
      email: decoded.email
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token."
    });
  }
}
