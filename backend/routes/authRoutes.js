import express from "express";

import { signup, login, getMe, logout } from "../controllers/authController.js"
import { protectedRoute } from "../middleware/protectedRoute.js";


const router = express.Router();

router.get("/me", protectedRoute, getMe);
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

export default router;