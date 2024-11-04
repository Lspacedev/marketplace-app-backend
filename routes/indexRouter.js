import { Router } from "express";
import indexController from "../controllers/indexController.js";
import Authenticate from "../middleware/Authenticate.js";
const indexRouter = Router();
indexRouter.post("/register", indexController.userRegister);
indexRouter.post("/login", indexController.userLogin);
indexRouter.get("/profile", Authenticate, indexController.getUser);
indexRouter.put("/profile", Authenticate, indexController.updateUser);
export default indexRouter;
