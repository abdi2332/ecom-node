import { Router } from "express";
import { placeOrder, getMyOrders } from "../controllers/orderController";
import { authenticate, requireUser } from "../middleware/auth";

const router = Router();

router.post("/", authenticate, requireUser, placeOrder);
router.get("/", authenticate, getMyOrders);

export default router;
