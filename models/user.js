import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  street: { type: String, required: true },
  town: { type: String, required: true },
  city: { type: String, required: true },
  country: { type: String, required: true },
  cart: [String],
  purchasedProducts: [String],
  role: { type: String, required: true, default: "BUYER" },
  profilePic: { type: String, required: false },
  createdAt: { type: Date, default: Date.now() },
});
const User = mongoose.model("User", userSchema);
export default User;
