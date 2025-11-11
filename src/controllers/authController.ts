import { Request, Response } from "express";
import prisma from "../prismaClient"; 
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { registerSchema, loginSchema } from "../utils/validator";

const JWT_SECRET = process.env.JWT_SECRET || "secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "24h";

export const register = async (req: Request, res: Response) => {
  const data = registerSchema.parse(req.body);
  // check uniqueness
  const existing = await prisma.user.findFirst({ where: { OR: [{ username: data.username }, { email: data.email }] } });
  if (existing) return res.status(400).json({ success: false, message: "username or email already in use" });

  const hashed = await bcrypt.hash(data.password, 10);
  const user = await prisma.user.create({ data: { username: data.username, email: data.email, password: hashed } });
  res.status(201).json({ success: true, message: "user created", object: { id: user.id, username: user.username, email: user.email } });
};

export const login = async (req: Request, res: Response) => {
  const data = loginSchema.parse(req.body);
  const user = await prisma.user.findUnique({ where: { email: data.email } });
  if (!user) return res.status(401).json({ success: false, message: "Invalid credentials" });

  const match = await bcrypt.compare(data.password, user.password);
  if (!match) return res.status(401).json({ success: false, message: "Invalid credentials" });

  const token = jwt.sign({ userId: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  res.json({ success: true, message: "login successful", object: { token } });
};
