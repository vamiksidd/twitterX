import dotenv from 'dotenv'
dotenv.config();


import express, { urlencoded } from "express";
import authRoutes from './routes/authRoutes.js'
import connectDb from './db/dbConnect.js';
import cookieParser from 'cookie-parser';

const port = process.env.PORT || 8000
const app = express()

connectDb()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use('/api/auth', (authRoutes))

app.listen(port, () => {
    console.log(`server runnning on port ${port}`);
})