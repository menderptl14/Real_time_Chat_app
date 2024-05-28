import jwt from "jsonwebtoken"

const isAuthenticated = async (req,res,next) =>{
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({
                success:false,
                message:'error in token generate '
            })
        }
        const decode = await jwt.verify(token,process.env.JWT_SECRET_KEY)
        if (!decode) {
            return res.status(401).json({
                success:false,
                message:'Invalid token'
            })
        }
        


    } catch (error) {
        return res.status(500).json({
            success:false,
            message:'error in Auth page'
        })
    }
}