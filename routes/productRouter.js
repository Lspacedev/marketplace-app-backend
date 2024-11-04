import { Router } from "express";
import productController from "../controllers/productController.js";
import Authenticate from "../middleware/Authenticate.js";
import Authorize from "../middleware/Authorize.js";
import uploadMiddleware from "../middleware/mutipleUpload.js";
const productRouter = Router();

productRouter.get(
  "/",
  Authenticate,
  Authorize("SELLER"),
  productController.getSellerProducts
);

productRouter.post(
  "/",
  Authenticate,
  Authorize("SELLER"),
  uploadMiddleware,
  productController.createProduct
);
productRouter.get(
  "/:productId",
  Authenticate,
  Authorize("SELLER"),
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
  "/:productId/hide",
  Authenticate,
  Authorize("SELLER"),
  productController.hideProduct
);
export default productRouter;
