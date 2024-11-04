import { Router } from "express";
import publicController from "../controllers/publicController.js";
import Authenticate from "../middleware/Authenticate.js";
const publicRouter = Router();

publicRouter.get("/", publicController.getAllProducts);

publicRouter.get("/:productId", publicController.getProductById);

publicRouter.put("/:productId/buy", Authenticate, publicController.buyProduct);

export default publicRouter;
