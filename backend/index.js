import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/database.js'
import userRoute from "./routes/userRoute.js"
import cookieParser from 'cookie-parser'

dotenv.config({})

const app = express()

const port = process.env.PORT || 8000

// middleware
app.use(express.json())

// routes
app.use("/api/v1/user",userRoute)
app.use(cookieParser())

app.listen(port, ()=>{
    connectDB()
    console.log(`Server is running at port no. ${port}`)
})

