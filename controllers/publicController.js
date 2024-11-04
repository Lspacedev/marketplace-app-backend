import Product from "../models/product.js";

async function getAllProducts(req, res) {
  try {
    const { page = 1, limit = 5 } = req.query;
    const skip = (page - 1) * limit;

    const products = await Product.find({ sellerId: req.user._id })
      .skip(skip)
      .limit(limit);
    const totalproducts = Product.countDocuments();
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
    if (product.status === "SOLD") {
      res.status(400).json({ error: "Product is already sold" });
    } else {
      const updatedProduct = await Product.updateOne(
        { _id: productId },

        { $set: { status: "SOLD" } }
      );
      res.status(201).json(updatedProduct);
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
