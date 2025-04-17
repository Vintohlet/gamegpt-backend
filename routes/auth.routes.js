import e from "express";
import AuthController from "../controllers/auth.controller.js"
import { registerValidator, loginValidator } from "../validators/auth.validator.js";

const router = e.Router();

router.post("/register", registerValidator, AuthController.userRegister);
router.post("/login", loginValidator, AuthController.userLogin);

export default router;