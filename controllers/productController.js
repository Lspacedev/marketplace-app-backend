import Product from "../models/product.js";
import cloudinary from "../config/cloudinary.js";

async function uploadToCloud(originalname, buffer, path) {
  const options = {
    resource_type: "image",
    public_id: originalname,
  };
  const result = await new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    uploadStream.end(buffer);
  });

  return { success: true, url: result.secure_url };
}
async function createProduct(req, res) {
  const {
    name,
    price,
    category,
    description,
    location,
    condition,
    tags,
    delivery,
  } = req.body;
  let product;
  try {
    let imageUrls = [];

    if (typeof req.files !== "undefined") {
      const files = req.files;
      if (files.length > 0) {
        for (const file of files) {
          const { originalname, path, size } = file;
          let result = await uploadToCloud(originalname, file.buffer, path);
          if (result.success !== false) {
            imageUrls.push(result.url);
          } else {
            res.status(500).json({ error: result.message });
          }
        }
      }
    }
    const productObj = {
      sellerId: req.user._id,
      name,
      price,
      category,
      description,
      location,
      condition,
      tags: JSON.parse(tags),
      delivery,
      images: imageUrls,
    };
    product = await Product.create(productObj);

    res.status(201).json(product);
  } catch (error) {
    console.log(error);
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
    const { name, price, description, location, condition, tags, delivery } =
      req.body;
    let isUpdate = false;
    let updatedproduct;
    if (name !== "") {
      updatedproduct = await Product.updateOne(
        { _id: productId },

        { $set: { name: name } }
      );
      isUpdate = true;
    }
    if (price !== "") {
      updatedproduct = await Product.updateOne(
        { _id: productId },

        { $set: { price: price } }
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
