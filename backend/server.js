import dotenv from 'dotenv'
dotenv.config();
import { v2 as cloudinary } from 'cloudinary';
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

import express from "express";

//Routes
import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js'
import notificationRoutes from './routes/notificationRoutes.js'

import connectDb from './db/dbConnect.js';
import cookieParser from 'cookie-parser';

const port = process.env.PORT || 8000
const app = express()

connectDb()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use('/api/auth', (authRoutes))
app.use('/api/users', (userRoutes))
app.use('/api/posts', (postRoutes))
app.use('/api/notification', (notificationRoutes))

app.listen(port, () => {
    console.log(`server runnning on port ${port}`);
})