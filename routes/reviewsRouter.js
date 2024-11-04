import { Router } from "express";
import reviewsController from "../controllers/reviewsController.js";
import Authenticate from "../middleware/authenticate.js";
const reviewsRouter = Router();

reviewsRouter.get("/", Authenticate, productController.getBuyerReviews);

reviewsRouter.post(
  "/:sellerId/review",
  Authenticate,
  productController.reviewSeller
);

export default reviewsRouter;
