import Product from "../models/product.js";
import User from "../models/user.js";

async function getAllProducts(req, res) {
  try {
    const { page = 1, limit = 5 } = req.query;
    const skip = (page - 1) * limit;

    const products = await Product.find().skip(skip).limit(limit);
    const totalproducts = await Product.countDocuments();
    res.status(200).json({ products, totalproducts, page, limit });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occured while fetching products." });
  }
}
async function getProductById(req, res) {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId);
    res.status(200).json(product);
  } catch (error) {
    if (error.kind === "ObjectId") {
      res.status(400).json({ error: "Invalid product id" });
    } else {
      res
        .status(500)
        .json({ error: "An error occured while fetching product." });
    }
  }
}
async function buyProduct(req, res) {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId);
    if (req.user._id != product.sellerId) {
      if (product.status === "SOLD") {
        res.status(400).json({ error: "Product is already sold" });
      } else {
        const updatedProduct = await Product.updateOne(
          { _id: productId },

          { $set: { status: "SOLD" } }
        );
        const user = await User.updateOne(
          { _id: req.user._id },
          { $pull: { purchasedProducts: {productId, seller: product.sellerId} } }
        );
        res.status(201).json(updatedProduct);
      }
    } else {
      res.status(400).json({ error: "Cannot buy own product" });
    }
  } catch (error) {
    res.status(500).json({ error: "An error occured while updating product." });
  }
}
export default {
  getAllProducts,
  getProductById,
  buyProduct,
};
