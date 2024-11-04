import { Router } from "express";
import publicController from "../controllers/publicController.js";
import Authenticate from "../middleware/authenticate.js";
const publicRouter = Router();

publicRouter.get("/", Authenticate, productController.getAllProducts);

publicRouter.get("/:productId", Authenticate, productController.getProductById);

publicRouter.post(
  "/:productId/buy",
  Authenticate,
  productController.buyProduct
);

export default publicRouter;
