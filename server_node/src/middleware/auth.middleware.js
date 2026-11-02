import { verifyToken } from "../utils/Solver.js";

export const authMiddleware = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Authorization token required" });
  }
  const token = authorization.split(' ')[1];

  try {
    const decoded = await verifyToken(token);
    req.user = decoded; 
    next();
  } catch (error) {
    console.error('JWT verification error:', error.message);
    return res.status(401).json({ error: "Request is not authorized" });
  }
};
