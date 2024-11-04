import { Router } from "express";
import productController from "../controllers/productController.js";
import Authenticate from "../middleware/authenticate.js";
import Authorize from "../middleware/Authorize.js";
const productRouter = Router();

productRouter.get("/", Authenticate, productController.getSellerProducts);

productRouter.post(
  "/",
  Authenticate,
  Authorize("SELLER"),
  productController.createProduct
);
productRouter.get(
  "/:productId",
  Authenticate,
  productController.getSellerProductById
);
productRouter.put(
  "/:productId",
  Authenticate,
  Authorize("SELLER"),
  productController.updateProduct
);
productRouter.delete(
  "/:productId",
  Authenticate,
  Authorize("SELLER"),
  productController.deleteProduct
);
productRouter.put(
  "/:productId",
  Authenticate,
  Authorize("SELLER"),
  productController.hideProduct
);
export default productRouter;
