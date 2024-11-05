import { Router } from "express";
import indexController from "../controllers/indexController.js";
import Authenticate from "../middleware/Authenticate.js";
import upload from "../middleware/upload.js";
const indexRouter = Router();
indexRouter.post(
  "/register",
  upload.single("profilePic"),
  indexController.userRegister
);
indexRouter.post("/login", indexController.userLogin);
indexRouter.get("/cart", Authenticate, indexController.getCart);
indexRouter.post("/cart", Authenticate, indexController.addToCart);
indexRouter.delete(
  "/cart/:productId",
  Authenticate,
  indexController.removeFromCart
);

indexRouter.get("/profile", Authenticate, indexController.getUser);
indexRouter.put("/profile", Authenticate, indexController.updateUser);
indexRouter.put(
  "/profile/become-seller",
  Authenticate,
  indexController.updateUserRole
);

export default indexRouter;
