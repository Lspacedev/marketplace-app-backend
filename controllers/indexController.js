import User from "../models/user.js";
import { body, validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cloudinary from "../config/cloudinary.js";
const alphaErr = "must only contain letters.";
const lengthErr = "must be between 1 and 25 characters.";
const passLengthErr = "must be between 5 and 25 characters.";

const streetLengthErr = "must be between 1 and 50 characters.";
const cityLengthErr = "must be between 1 and 50 characters.";
const townLengthErr = "must be between 1 and 50 characters.";

const validateRegister = [
  body("username")
    .trim()
    .isAlpha()
    .withMessage(`Username ${alphaErr}`)
    .isLength({ min: 1, max: 25 })
    .withMessage(`Username ${lengthErr}`),

  body("email").isEmail().withMessage("Not a valid e-mail address"),
  body("password")
    .isLength({ min: 5, max: 25 })
    .withMessage(`Password ${passLengthErr}`),
  // body("street")
  //   .trim()
  //   .isAlpha()
  //   .withMessage(`Street ${alphaErr}`)
  //   .isLength({ min: 1, max: 50 })
  //   .withMessage(`Street ${streetLengthErr}`),
  body("city")
    .trim()
    .isAlpha()
    .withMessage(`City ${alphaErr}`)
    .isLength({ min: 1, max: 50 })
    .withMessage(`City ${cityLengthErr}`),
  body("town")
    .trim()
    .isAlpha()
    .withMessage(`Town ${alphaErr}`)
    .isLength({ min: 1, max: 50 })
    .withMessage(`Town ${townLengthErr}`),
];

const userRegister = [
  validateRegister,
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(500).json({
        errors: errors.array(),
      });
    }
    try {
      const { username, email, password, street, town, city, country } =
        req.body;

      const hashedPassword = await bcrypt.hash(password, 10);
      let imageUrl = "";
      if (typeof req.file !== "undefined") {
        const { originalname, path } = req.file;
        //upload image
        if (originalname !== "") {
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
          imageUrl = result.secure_url;
        }
      }
      const user = await User.create({
        username,
        email,
        street,
        town,
        city,
        country,
        password: hashedPassword,
        profilePic: imageUrl,
      });
      return res.status(201).json({ message: "Registration successful" });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ error: "An error occured during registration" });
    }
  },
];

async function userLogin(req, res) {
  try {
    const { username, password } = req.body;
    const [user] = await User.find({ username });
    if (user.length === 0) {
      return res.status(404).json({ message: "User does not exist." });
    }
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "3h" }
    );

    return res.status(200).json({
      message: "Auth Passed",
      token,
    });
  } catch (error) {
    res.status(500).json({ error: "An error occured while logging in." });
  }
}
async function getUser(req, res) {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json(user);
  } catch (error) {
    if (error.kind === "ObjectId") {
      res.status(400).json({ error: "Invalid user id" });
    } else {
      res.status(500).json({ error: "An error occured while fetching user." });
    }
  }
}
async function updateUser(req, res) {
  try {
    const userId = req.user._id;
    const { username, email, password } = req.body;
    let isUpdate = false;
    let updatedUser;
    if (username !== "") {
      updatedUser = await User.updateOne(
        { _id: userId },

        { $set: { username: username } }
      );
      isUpdate = true;
    }
    if (email !== "") {
      updatedUser = await User.updateOne(
        { _id: userId },

        { $set: { email: email } }
      );
      isUpdate = true;
    }
    if (password !== "") {
      const hashedPassword = await bcrypt.hash(password, 10);
      updatedUser = await User.updateOne(
        { _id: userId },

        { $set: { password: hashedPassword } }
      );
      isUpdate = true;
    }
    if (isUpdate) {
      res.status(201).json(updatedUser);
    } else {
      res.status(400).json({ error: "Nothing to update." });
    }
  } catch (error) {
    res.status(500).json({ error: "An error occured while updating user." });
  }
}

async function updateUserRole(req, res) {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);

    if (user.role === "SELLER") {
      res.status(400).json({ error: "User is already a seller" });
    } else {
      const updatedUser = await User.updateOne(
        { _id: userId },

        { $set: { role: "SELLER" } }
      );
      res.status(201).json(updatedUser);
    }
  } catch (error) {
    res.status(500).json({ error: "An error occured while updating user." });
  }
}

async function getCart(req, res) {
  try {
    const user = await User.findById(req.user._id);

    res.status(200).json(user.cart);
  } catch (error) {
    if (error.kind === "ObjectId") {
      res.status(400).json({ error: "Invalid user id" });
    } else {
      res
        .status(500)
        .json({ error: "An error occured while fetching user cart." });
    }
  }
}
async function addToCart(req, res) {
  try {
    const { productId } = req.body;
    const user = await User.updateOne(
      { _id: req.user._id },
      { $push: { cart: productId } }
    );

    res.status(200).json(user.cart);
  } catch (error) {
    if (error.kind === "ObjectId") {
      res.status(400).json({ error: "Invalid user id" });
    } else {
      res
        .status(500)
        .json({ error: "An error occured while adding to user cart." });
    }
  }
}
async function removeFromCart(req, res) {
  try {
    const { productId } = req.params;
    const user = await User.updateOne(
      { _id: req.user._id },
      { $pull: { cart: productId } }
    );
    res.status(200).json(user.cart);
  } catch (error) {
    if (error.kind === "ObjectId") {
      res.status(400).json({ error: "Invalid user id" });
    } else {
      res
        .status(500)
        .json({ error: "An error occured while removbing from user cart." });
    }
  }
}
export default {
  userRegister,
  userLogin,
  getUser,
  updateUser,
  updateUserRole,
  getCart,
  addToCart,
  removeFromCart,
};
