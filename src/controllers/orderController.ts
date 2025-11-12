import { Request, Response } from "express";
import prisma from "../prismaClient"; 
import { placeOrderSchema } from "../utils/validator";
import { AuthRequest } from "../middleware/auth";

export const placeOrder = async (req: AuthRequest, res: Response) => {
  const user = req.user!;
  const items = placeOrderSchema.parse(req.body);

  // Start transaction:
  try {
    const result = await prisma.$transaction(async (tx) => {
      // Fetch products
      const productIds = items.map(i => i.productId);
      const products = await tx.product.findMany({ where: { id: { in: productIds } } });

      if (products.length !== productIds.length) {
        // find missing product
        const foundIds = products.map(p => p.id);
        const missing = productIds.find(id => !foundIds.includes(id));
        throw { status: 404, message: `Product ${missing} not found` };
      }

      // check stock
      for (const it of items) {
        const p = products.find(x => x.id === it.productId)!;
        if (p.stock < it.quantity) {
          throw { status: 400, message: `Insufficient stock for ${p.name}` };
        }
      }

      // deduct stock & compute total
      let totalPrice = 0;
      for (const it of items) {
        const p = products.find(x => x.id === it.productId)!;
        await tx.product.update({
          where: { id: p.id },
          data: { stock: p.stock - it.quantity }
        });
        totalPrice += p.price * it.quantity;
      }

      const order = await tx.order.create({
        data: {
          userId: user.userId,
          totalPrice,
          status: "pending",
        },
      });

      // create items
      for (const it of items) {
        const p = products.find(x => x.id === it.productId)!;
        await tx.orderItem.create({
          data: {
            orderId: order.id,
            productId: p.id,
            quantity: it.quantity,
            unitPrice: p.price,
          },
        });
      }

      // fetch full order to return
      const full = await tx.order.findUnique({
        where: { id: order.id },
        include: { items: { include: { product: true } } }
      });
      return full!;
    });

    res.status(201).json({ success: true, message: "order created", object: result });
  } catch (err: any) {
    if (err && err.status) return res.status(err.status).json({ success: false, message: err.message });
    console.error(err);
    res.status(500).json({ success: false, message: "server error" });
  }
};

export const getMyOrders = async (req: AuthRequest, res: Response) => {
  const user = req.user!;
  const orders = await prisma.order.findMany({
    where: { userId: user.userId },
    orderBy: { createdAt: "desc" },
    include: { items: { include: { product: true } } }
  });
  res.json({ success: true, message: "orders fetched", object: orders });
};
