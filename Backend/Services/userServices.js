

import { errorRes, successRes } from "../helpers/response.js"
import generateToken from "../helpers/generateToken.js"
import bcrypt from "bcrypt"
import uploadOnCloudinary from "../helpers/cloudinary.js"
import User from "../Models/userModel.js"


export const userServices = {
    registration: async (req, res) => {
        const { name, email, password,deviceToken } = req.body
        let image;
        let cloudinaryImage
        if (req?.files?.pic) {
            image = req.files.pic[0].path
             cloudinaryImage = await uploadOnCloudinary(image)
        }
       
      



        let userExist = await User.findOne({ email })
        if (userExist) {
            return errorRes(res, 400, "User already exist")
        }

        let hanshedPassword = await bcrypt.hash(password, 10)

        const user = await User.create({
            name, email, password: hanshedPassword, pic: cloudinaryImage?.url,deviceToken
        })
        const token = await generateToken(user?._id)
        const result = {
            user,
            token,
        };


        if (user) {
            return successRes(res, 201, "User registered successfully", result)
        } else {
            return errorRes(res, 400, "Failed to create the user")
        }


    },

    login: async (req, res) => {
        const { email, password,deviceToken } = req.body

        let userExist = await User.findOne({ email })
        console.log(userExist, "user")

        if (!userExist) {
            return errorRes(res, 400, "User does not exist")

        } else {

            let checkPassword = await bcrypt.compare(password, userExist?.password)
            if (checkPassword) {
                let token = await generateToken(userExist?._id)
                let result = {
                    user: userExist,
                    token
                }
                if (deviceToken) {
                    await User.findByIdAndUpdate(userExist?._id, { deviceToken });
                }
        
                return successRes(res, 201, "User successfully login", result)

            } else {
                return errorRes(res, 400, "Invalid credentials")
            }
        }




    },

    search: async (req, res) => {
        const { search } = req.query
        let userId = req.user
      

        if (search) {
            let data = await User.find({ $or: [
                {name:{$regex:search,$options:"i"}},
                {email:{$regex:search,$options:"i"}}
            ] }).find({_id:{$ne:userId?.userId}})
            return successRes(res,200,"User found successfully",data)
        }
        
    }
}