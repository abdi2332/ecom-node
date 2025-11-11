import { Router } from "express";
import { createProduct, updateProduct, deleteProduct, getProduct, listProducts } from "../controllers/productController";
import { authenticate, requireAdmin } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { createProductSchema, updateProductSchema } from "../utils/validator";

const router = Router();

router.get("/", listProducts);
router.get("/:id", getProduct);

router.post("/", authenticate, requireAdmin, validate(createProductSchema), createProduct);
router.put("/:id", authenticate, requireAdmin, validate(updateProductSchema), updateProduct);
router.delete("/:id", authenticate, requireAdmin, deleteProduct);

export default router;
