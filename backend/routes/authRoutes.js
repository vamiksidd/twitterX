import express from "express";
const router = express.Router()
import {
    userLogIn,
    userLogOut,
    userSignUp,
    getUser
} from '../controllers/authController.js'
import { protectedRoute } from "../middleware/protectedRoute.js";

router.get("/getuser", protectedRoute, getUser)

router.post('/signup', userSignUp)

router.post('/login', userLogIn)

router.get('/logout', userLogOut)


export default router