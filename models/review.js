import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  reviewer: { type: String, required: true },
  seller: { type: String, required: true },
  text: { type: String, required: true },
  rating: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now() },
});
const Review = mongoose.model("Review", reviewSchema);
export default Review;
