import express from "express";
import { signup, login } from "../controllers/authController.js";
import { signupValidator, loginValidator } from "../validators/authValidators.js";
import { validate } from "../middleware/errorHandler.js";

const router = express.Router();

router.post("/signup", signupValidator, validate, signup);
router.post("/login", loginValidator, validate, login);

export default router;
