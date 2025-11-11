import { Router } from "express";
import { placeOrder, getMyOrders } from "../controllers/orderController";
import { authenticate } from "../middleware/auth";

const router = Router();

router.post("/", authenticate, placeOrder);
router.get("/", authenticate, getMyOrders);

export default router;
