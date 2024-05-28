import {User} from "../models/userModel.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export const register = async(req,res) =>{
    try {
        const {fullName, username,password,confirmPassword,gender} = req.body

        if (!fullName, !username, !password, !confirmPassword,!gender) {
            return res.status(400).json({
                success:false,
                message:'All feilds are required true'
            })
        }

        if (password !== confirmPassword) {
            return  res.status(400).json({
                success:false,
                message:'Password does not match'
            })    
        }

        const user = await User.findOne({username})
        
        if (user) {
            return res.status(400).json({
                success:false,
                message:'User already exits'
            })
        }

        const hashPassword = await bcrypt.hash(password,10)

        // profile photo
        const maleProfilePhoto = `https://avatar.iran.liara.run/public/boy/username:${username}`
        const femaleProfilePhoto = `https://avatar.iran.liara.run/public/girl/username:${username}`

        await user.create({
            fullName,
            username,
            password:hashPassword,
            profilePhoto : gender === male ? maleProfilePhoto : femaleProfilePhoto,
            gender,
        })
        
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:'error in register user'
        })
    }
}


export const login = async (req,res) => {
    try {
        const {username,password} = req.body

        if (!username || !password) {
            return res.status(400).json({
                success:false,
                message:"all fields are required"
            })
        }

        const user = await User.findOne({username})

        if (!user) {
            return res.status(400).json({
                success:false,
                message:"User is not exits , plz login the page"
            })
        }

        const isPassword = await bcrypt.compare(password,user.password)

        if (!isPassword) {
            return res.status(400).json({
                success:false,
                message:"Password is incorrect"
            })
        }

        const tokenData = {
            userId : user._id
        } 

        const token = await jwt.sign(tokenData,process.env.JWT_SECRET_KEY, {expiresIn:'1d'})

        return res.status(200).cookie(
            "token",
            token,
            {maxAge: 1*24*60*60*1000, httpOnly:true, sameSite:'strict'}.json({
                _id:user._id,
                username:user.username,
                profilePhoto:user.profilePhoto,
                fullName:user.fullName,
            })
        )
        
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:'error in login page'
        })
     }
}

export const logout = async (req,res) =>{
    try {
        return res.cookie('token' ,"", {maxAge:0}).json({
            success:true,
            message:'user logout successfully'
        })
        
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:'error in logout page'
        })   
    }
}

export const getOtherUser = async (req,res) =>{
    try {
        const loggedInUserId = req.id;
        const otherUsers = await User.find({_id:{$ne:loggedInUserId}}).select("-password");
        return res.status(200).json(otherUsers)
        
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:'error in get ohter useer '
        })
    }
}