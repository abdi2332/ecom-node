import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth";
import productRoutes from "./routes/products";
import orderRoutes from "./routes/order";
import { swaggerUi, specs } from "./docs/swagger";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.get("/", (req, res) => res.json({ success: true, message: "API ok" }));

export default app;