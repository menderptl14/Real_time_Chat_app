import {User, user} from "../models/userModel.js"
import bcrypt from "bcryptjs"

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

