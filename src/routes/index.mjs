import userRouter from "./users.mjs";
import productRouter from "./products.mjs";
import { Router } from "express";

const router = Router();

router.use(userRouter);
router.use(productRouter);

export default router;
