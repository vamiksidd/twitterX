import express from "express";
import { protectedRoute } from "../middleware/protectedRoute.js";
import { getNotifications ,deleteNotifications} from "../controllers/notificationController.js";
const router = express.Router()

router.get("/", protectedRoute, getNotifications)
router.delete("/", protectedRoute, deleteNotifications)

export default router;