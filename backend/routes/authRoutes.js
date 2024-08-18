import express from "express";
const router = express.Router()
import {
    userLogIn,
    userLogOut,
    userSignUp
} from '../controllers/authController.js'


router.post('/signup', userSignUp)

router.post('/login', userLogIn)

router.get('/logout', userLogOut)


export default router