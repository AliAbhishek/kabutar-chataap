import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()

const generateToken=async(id)=>{
    const token = await jwt.sign({userId:id},process.env.JWT_SECRET,{expiresIn:"30d"})
    return token
}

export default generateToken