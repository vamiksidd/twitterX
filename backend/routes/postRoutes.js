import express from "express";
const router = express.Router();

import { protectedRoute } from "../middleware/protectedRoute.js";
import { createPost, deletePost ,commentOnPost ,likeUnlikePost , getAllPosts} from "../controllers/postController.js";


router.get("/allposts",protectedRoute , getAllPosts);
router.post("/create", protectedRoute, createPost)
router.post("/like/:id",protectedRoute , likeUnlikePost)
router.post("/comment/:id",protectedRoute, commentOnPost)
router.delete("/delete/:id", protectedRoute, deletePost)

export default router