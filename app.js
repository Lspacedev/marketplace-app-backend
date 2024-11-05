import "dotenv/config";
import express from "express";
import cors from "cors";
import passport from "passport";
import path from "path";
import { fileURLToPath } from "url";

import mongooseConnection from "./config/mongodb.js";
import jwtStrategy from "./middleware/Jwt.js";

import indexRouter from "./routes/indexRouter.js";
import publicRouter from "./routes/publicRouter.js";
import productRouter from "./routes/productRouter.js";
import reviewsRouter from "./routes/reviewsRouter.js";
const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
passport.use(jwtStrategy);
mongooseConnection();
app.use(express.static(path.join(__dirname, "/uploads")));

app.use("/api", indexRouter);
app.use("/api/public/products", publicRouter);
app.use("/api/public/reviews", reviewsRouter);
app.use("/api/products", productRouter);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Express app listening on port ${PORT}!`));
