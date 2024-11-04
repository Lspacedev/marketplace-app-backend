import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  sellerId: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  condition: { type: String, required: true },
  tags: { type: Array },
  delivery: { type: String, required: true, default: "Standard - R50" },
  status: { type: String, required: true, default: "pending" },
  images: { type: Array },
  createdAt: { type: Date, default: Date.now() },
});
const Product = mongoose.model("Product", productSchema);
export default Product;