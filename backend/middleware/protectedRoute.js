import User from "../models/userModel.js"
import jwt from "jsonwebtoken"
export const protectedRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ error: "Unauthorized : No token provided" })
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if (!decoded) {
            return res.status(401).json({ error: "Unauthorized : Token Invalid" })
        }

        const user = await User.findById(decoded.userId).select("-password");
        if (user) {
            req.user = user;
            next();
        }
        else {
            return res.status(404).json({ message: "user not found" })
        }
    } catch (error) {
        console.log("error in middleware", error.message);
        res.status(500).json({ error: "Internal Server error" })
    }
}