import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export interface AuthRequest extends Request {
  user?: { userId: string; username: string; role: string };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const auth = req.header("Authorization");
  if (!auth) return res.status(401).json({ success: false, message: "Missing Authorization header" });
  const parts = auth.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") return res.status(401).json({ success: false, message: "Invalid Authorization format" });

  try {
    const payload = jwt.verify(parts[1], JWT_SECRET) as any;
    req.user = { userId: payload.userId, username: payload.username, role: payload.role };
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) return res.status(401).json({ success: false, message: "Unauthorized" });
  if (req.user.role !== "Admin") return res.status(403).json({ success: false, message: "Forbidden: admin only" });
  next();
};

export const requireUser = (req: AuthRequest, res: Response, next: NextFunction) => {
	if (!req.user) return res.status(401).json({ success: false, message: "Unauthorized" });
	if (req.user.role !== "User" )return res.status(403).json({ success: false, message: "Forbidden: user only" });
	next();
}
