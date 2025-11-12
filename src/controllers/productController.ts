import { Request, Response } from "express";
import prisma from "../prismaClient"; 
import { createProductSchema, updateProductSchema } from "../utils/validator";
import { Prisma } from "@prisma/client";
import { cache } from "../utils/cache";
import multer from "multer";
import { uploadToCloudinary } from "../utils/cloudinary";

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
  const search = (req.query.search as string) || '';
  const category = (req.query.category as string) || '';
  const minPrice = Number(req.query.minPrice) || 0;
  const maxPrice = Number(req.query.maxPrice) || Number.MAX_SAFE_INTEGER;
  const sortBy = (req.query.sortBy as string) || 'createdAt';
  const sortOrder = (req.query.sortOrder as string) || 'desc';

  
  const cacheKey = cache.generateProductsCacheKey(page, pageSize, search, { category });


  try {
    const cached = await cache.get(cacheKey);
    if (cached) {
   	 
      return res.json(cached);
    }
  } catch (error) {
    console.error("Cache error:", error);
  }
  console.log('Cache miss, querying database');

  // Build where clause
  const where: any = {};
  if (search) {
    where.name = { contains: search, mode: "insensitive" };
  }
  if (category) {
    where.category = category;
  }

	where.price = { gte: minPrice, lte: maxPrice };

	const orderBy: any = {};
  orderBy[sortBy] = sortOrder;

  const total = await prisma.product.count({ where });
  const products = await prisma.product.findMany({
    where,
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy,
    select: { 
      id: true, name: true, price: true, stock: true, 
      category: true, description: true, createdAt: true 
    },
  });

	const categories = await prisma.product.findMany({
    distinct: ['category'],
    select: { category: true },
    where: { category: { not: null } }
  });

  const totalPages = Math.ceil(total / pageSize);

  const response = {
    currentPage: page,
    pageSize: pageSize,
    totalPages: totalPages,
    totalProducts: total,
    products: products,
    filters: {
      categories: categories.map(c => c.category).filter(Boolean),
      priceRange: { min: 0, max: 1000}
    }
  };

  
  await cache.set(cacheKey, response);

  res.json(response);
};


export const upload = multer({ storage: multer.memoryStorage() });

export const uploadProductImage = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image provided' });
    }

    const imageUrl = await uploadToCloudinary(req.file);
    
    // Update product with image URL
    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: { imageUrl },
    });

    res.json({ success: true, message: 'Image uploaded', object: product });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Image upload failed' });
  }
};
