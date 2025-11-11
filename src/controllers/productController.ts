import { Request, Response } from "express";
import { prisma } from "../prismaClient";
import { createProductSchema, updateProductSchema } from "../utils/validator";
import { Prisma } from "@prisma/client";

export const createProduct = async (req: Request, res: Response) => {
  const data = createProductSchema.parse(req.body);
  const product = await prisma.product.create({ data });
  res.status(201).json({ success: true, message: "product created", object: product });
};

export const updateProduct = async (req: Request, res: Response) => {
  const id = req.params.id;
  const payload = updateProductSchema.parse(req.body);
  try {
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ success: false, message: "Product not found" });
    const product = await prisma.product.update({ where: { id }, data: payload as Prisma.ProductUpdateInput });
    res.json({ success: true, message: "product updated", object: product });
  } catch (err: any) {
    res.status(500).json({ success: false, message: "server error" });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  const id = req.params.id;
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) return res.status(404).json({ success: false, message: "Product not found" });
  await prisma.product.delete({ where: { id } });
  res.json({ success: true, message: "Product deleted successfully" });
};

export const getProduct = async (req: Request, res: Response) => {
  const id = req.params.id;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return res.status(404).json({ success: false, message: "Product not found" });
  res.json({ success: true, message: "product fetched", object: product });
};

export const listProducts = async (req: Request, res: Response) => {
  const page = Math.max(1, Number(req.query.page || 1));
  const pageSize = Math.max(1, Number(req.query.pageSize || req.query.limit || 10));
  const search = (req.query.search as string) || "";

  const where = search ? { name: { contains: search, mode: "insensitive" } } : {};

  const total = await prisma.product.count({ where });
  const products = await prisma.product.findMany({
    where,
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, price: true, stock: true, category: true },
  });

  const totalPages = Math.ceil(total / pageSize);

  res.json({
    success: true,
    message: "products list",
    object: products,
    pageNumber: page,
    pageSize,
    totalSize: total,
    totalPages,
  });
};
