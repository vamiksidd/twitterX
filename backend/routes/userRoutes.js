import express from "express";
import { protectedRoute } from "../middleware/protectedRoute.js";
import { followUnfollowUser, getSuggestedUser, getUserProfile, updateUserProfile } from "../controllers/userController.js";
const router = express.Router()



router.get("/profile/:username", getUserProfile)
// router.get("/allusers", getAllProfiles)
router.get("/suggestion", protectedRoute, getSuggestedUser)
router.post("/follow/:id", protectedRoute, followUnfollowUser)
router.put("/update", protectedRoute, updateUserProfile)

export default router