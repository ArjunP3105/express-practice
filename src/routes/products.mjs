import { Router } from "express";

const router = Router();

router.get("/api/products", (req, res) => {
  console.log(req.cookies);

  if (req.cookies.key && req.cookies.key === "value")
    return res.status(200).send([{ id: 1, name: "Chicken", price: 12.99 }]);

  return res.status(402).send({
    message: "cookies expired",
  });
});

export default router;
