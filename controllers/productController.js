import Product from "../models/product.js";
import cloudinary from "../config/cloudinary.js";

async function uploadToCloud(originalname, path) {
  const options = {
    resource_type: "image",
    public_id: originalname,
  };
  //upload to cloudinary
  const result = await cloudinary.uploader.upload(
    path,
    options,
    async function (err, result) {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }

      return result;
    }
  );
  return result.secure_url;
}
async function createProduct(req, res) {
  try {
    let imageUrls = [];
    if (typeof req.files !== "undefined") {
      const files = req.files;
      if (files.length > 0) {
        files.forEach((file) => {
          const { originalname, path, size } = file;
          let imageUrl = uploadToCloud(originalname, path);
          imageUrls.push(imageUrl);
        });
      }
    }
    const { name, description, location, condition, tags, delivery } = req.body;

    const productObj = {
      sellerId: req.user._id,
      name,
      description,
      location,
      condition,
      tags,
      delivery,
    };
    const product = await Product.create(productObj);

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: "An error occured while creating product." });
  }
}
async function getSellerProducts(req, res) {
  try {
    const { page = 1, limit = 5 } = req.query;
    const skip = (page - 1) * limit;

    const products = await Product.find({ sellerId: req.user._id })
      .skip(skip)
      .limit(limit);
    const totalproducts = products.length;
    res.status(200).json({ products, totalproducts, page, limit });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occured while fetching products." });
  }
}

async function getSellerProductById(req, res) {
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

async function updateProduct(req, res) {
  try {
    const { productId } = req.params;
    const { name, description, location, condition, tags, delivery } = req.body;
    let isUpdate = false;
    let updatedproduct;
    if (name !== "") {
      updatedproduct = await Product.updateOne(
        { _id: productId },

        { $set: { name: name } }
      );
      isUpdate = true;
    }
    if (description !== "") {
      updatedproduct = await Product.updateOne(
        { _id: productId },

        { $set: { description: description } }
      );
      isUpdate = true;
    }
    if (location !== "") {
      updatedproduct = await Product.updateOne(
        { _id: productId },

        { $set: { location: location } }
      );
      isUpdate = true;
    }
    if (condition !== "") {
      updatedproduct = await Product.updateOne(
        { _id: productId },

        { $set: { condition: condition } }
      );
      isUpdate = true;
    }
    if (tags.length !== 0) {
      updatedproduct = await Product.updateOne(
        { _id: productId },

        { $set: { tags: tags } }
      );
      isUpdate = true;
    }
    if (delivery !== "") {
      updatedproduct = await Product.updateOne(
        { _id: productId },

        { $set: { delivery: delivery } }
      );
      isUpdate = true;
    }

    if (isUpdate) {
      res.status(201).json(updatedproduct);
    } else {
      res.status(400).json({ error: "Nothing to update." });
    }
  } catch (error) {
    res.status(500).json({ error: "An error occured while updating product." });
  }
}
async function deleteProduct(req, res) {
  try {
    const { productId } = req.params;
    const deleteproduct = await Product.deleteOne({ _id: productId });
    res.status(200).json(deleteproduct);
  } catch (error) {
    res.status(500).json({ error: "An error occured while deleting product." });
  }
}
async function hideProduct(req, res) {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId);
    if (product.status === "HIDDEN") {
      res.status(400).json({ error: "Product is already a hidden" });
    } else {
      const updatedProduct = await Product.updateOne(
        { _id: productId },

        { $set: { status: "HIDDEN" } }
      );
      res.status(201).json(updatedUser);
    }
  } catch (error) {
    res.status(500).json({ error: "An error occured while updating product." });
  }
}
export default {
  createProduct,
  getSellerProducts,
  getSellerProductById,
  updateProduct,
  deleteProduct,
  hideProduct,
};
