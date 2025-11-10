import { z } from "zod";

export const registerSchema = z.object({
  username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9]+$/, "Username must be alphanumeric"),
  email: z.string().email(),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .refine(p => /[A-Z]/.test(p), "Must include uppercase")
    .refine(p => /[a-z]/.test(p), "Must include lowercase")
    .refine(p => /[0-9]/.test(p), "Must include number")
    .refine(p => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(p), "Must include special char"),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const createProductSchema = z.object({
  name: z.string().min(3).max(100),
  description: z.string().min(10),
  price: z.number().positive(),
  stock: z.number().int().nonnegative(),
  category: z.string().optional(),
});

export const updateProductSchema = createProductSchema.partial();

export const placeOrderSchema = z.array(z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().min(1),
}));
