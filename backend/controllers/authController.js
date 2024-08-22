import User from "../models/userModel.js"
import bcrypt from 'bcryptjs'
import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";

const userSignUp = async (req, res) => {
    try {
        const { fullName, username, email, password } = req.body;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new Error('Email not valid')
        }

        const userEmail = await User.findOne({ email });
        const userName = await User.findOne({ username });
        if (userEmail) {
            return res.status(400).json({ message: "email already exist" })
        }
        if (userName) {
            return res.status(400).json({ message: "username already exist" })
        }
        if (password.length < 6) {
            return res.status(400).json({ error: "password length must be greater than or equal to 6" })
        }

        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({
            fullName,
            username,
            email,
            password: hashedPassword
        })
        if (newUser) {
            generateTokenAndSetCookie(newUser._id, res)
            await newUser.save();
            return res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                username: newUser.username,
                email: newUser.email,
                followers: newUser.followers,
                following: newUser.following,
                profileImg: newUser.profileImg,
                coverImg: newUser.coverImg
            })
        } else {
            res.status(400).json({ error: 'Invalid user data' })
        }
    }
    catch (err) {
        console.log(err, 'Error in signup');
    }
}

const userLogIn = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = await User.findOne({ username });
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

        if (!user || !isPasswordCorrect) {
            return res.status(400).json({ error: "Invalid credentials" })
        }

        generateTokenAndSetCookie(user._id, res);
        return res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            username: user.username,
            email: user.email,
            followers: user.followers,
            following: user.following,
            profileImg: user.profileImg,
            coverImg: user.coverImg
        })
    }
    catch (err) {
        console.log(err, 'Error in login');
    }
}

const userLogOut = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out" })
    } catch (error) {
        res.status(400).json({ error })
    }
}

const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password")
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({ error: "Internal Server error" })
    }
}



export {
    userSignUp,
    userLogIn,
    userLogOut,
    getUser
}