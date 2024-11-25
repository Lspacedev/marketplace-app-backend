import { Router } from "express";
import reviewsController from "../controllers/reviewsController.js";
import Authenticate from "../middleware/Authenticate.js";
const reviewsRouter = Router();

reviewsRouter.get("/", Authenticate, reviewsController.getBuyerReviews);

reviewsRouter.post(
  "/",
  Authenticate,
  reviewsController.reviewSeller
);

export default reviewsRouter;
