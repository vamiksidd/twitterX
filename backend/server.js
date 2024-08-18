import dotenv from 'dotenv'
dotenv.config();


import express, { urlencoded } from "express";
import authRoutes from './routes/authRoutes.js'
import connectDb from './db/dbConnect.js';

const port = process.env.PORT || 8000
const app = express()

connectDb()
app.use(express.json())
app.use(urlencoded())

app.use('/api/auth', (authRoutes))

app.get("/", (req, res) => {
    res.send('hellow')
})
app.listen(port, () => {
    console.log(`server runnning on port ${port}`);
})