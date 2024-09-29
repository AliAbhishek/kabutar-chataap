

import { errorRes, successRes } from "../helpers/response.js"
import generateToken from "../helpers/generateToken.js"
import bcrypt from "bcrypt"
import uploadOnCloudinary from "../helpers/cloudinary.js"
import User from "../Models/userModel.js"
import Chat from "../Models/chatModel.js"


export const userServices = {
    registration: async (req, res) => {
        const { name, email, password, deviceToken } = req.body
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
            name, email, password: hanshedPassword, pic: cloudinaryImage?.url, deviceToken
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
        const { email, password, deviceToken } = req.body;

        console.time("MongoDB Query - Find User");
        let userExist = await User.findOne({ email });
        console.timeEnd("MongoDB Query - Find User");

        console.log(userExist, "user");

        if (!userExist) {
            return errorRes(res, 400, "User does not exist");
        } else {
            console.time("Password Comparison");
            let checkPassword = await bcrypt.compare(password, userExist?.password);
            console.timeEnd("Password Comparison");

            if (checkPassword) {
                let token = await generateToken(userExist?._id);
                let result = {
                    user: userExist,
                    token
                };

                if (deviceToken) {
                    await User.findByIdAndUpdate(userExist?._id, { deviceToken });
                }

                return successRes(res, 201, "User successfully login", result);
            } else {
                return errorRes(res, 400, "Invalid credentials");
            }
        }
    },


    search: async (req, res) => {
        const { search } = req.query
        let userId = req.user


        if (search) {
            let data = await User.find({
                $or: [
                    { name: { $regex: search, $options: "i" } },
                    { email: { $regex: search, $options: "i" } }
                ]
            }).find({ _id: { $ne: userId?.userId } })

            // let chats = await Chat.find({
            //     chatName: { $regex: search, $options: "i" },
            //   })
            //   console.log(chats,"chatsss")

            return successRes(res, 200, "User found successfully", data)
        }

    },

    editProfile: async (req, res) => {
        let userId = req.user.userId
        console.log(userId, "userId")
        const { name, email } = req.body
        let image;
        let cloudinaryImage
        if (req?.files?.pic) {
            image = req.files.pic[0].path
            cloudinaryImage = await uploadOnCloudinary(image)
        }

        console.log(name,"name")


        let userExist = await User.findByIdAndUpdate(userId, {
            $set: {
                name, email, pic: cloudinaryImage?.url
            }
        }, { new: true })


        if (!userExist) {
            return errorRes(res, 400, "User did not exist")
        } else {
            return successRes(res, 201, "User profile updated successfully", userExist)
        }

    }


}