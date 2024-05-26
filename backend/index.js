import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/database.js'
dotenv.config({})

const app = express()


const port = process.env.PORT || 8000

app.get("/", (req,res)=>{
    res.send("Set h")
})

app.listen(port, ()=>{
    connectDB()
    console.log(`Server is running at port no. ${port}`)
})
