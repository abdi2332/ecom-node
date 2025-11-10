import { Request, Response, NextFunction } from "express";
import { AnyZodObject } from "zod";

export const validate = (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate body
    schema.parse(req.body);
    next();
  } catch (err: any) {
    const errors = err.errors ? err.errors.map((e: any) => e.message) : [err.message];
    res.status(400).json({ success: false, message: "Validation error", errors });
  }
};
