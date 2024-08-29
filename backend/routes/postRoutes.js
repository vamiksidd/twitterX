import express from "express";
const router = express.Router();

import { protectedRoute } from "../middleware/protectedRoute.js";
import { createPost, deletePost ,commentOnPost ,likeUnlikePost , getAllPosts ,getLikedPosts , getFollowingPosts , getUserPosts} from "../controllers/postController.js";



router.get("/following" ,protectedRoute, getFollowingPosts)
router.get("/likedposts/:id" , protectedRoute ,getLikedPosts)
router.get("/allposts",protectedRoute , getAllPosts);
router.get("/userposts/:username",protectedRoute,getUserPosts)
router.post("/create", protectedRoute, createPost)
router.post("/like/:id",protectedRoute , likeUnlikePost)
router.post("/comment/:id",protectedRoute, commentOnPost)
router.delete("/delete/:id", protectedRoute, deletePost)

export default router