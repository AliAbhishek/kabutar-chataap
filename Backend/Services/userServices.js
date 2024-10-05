

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
        let userId = req.user.userId;
        console.log(userId, "userId");
        const { name, email } = req.body;
        let image;
        let backgroundPic;
        let cloudinarybgImage;
        let cloudinaryImage;

        // If a profile picture is uploaded
        if (req?.files?.pic) {
            image = req.files.pic[0].path;
            cloudinaryImage = await uploadOnCloudinary(image);
        }

        // If a background picture is uploaded
        if (req?.files?.backgroundPic) {
            backgroundPic = req.files.backgroundPic[0].path;
            cloudinarybgImage = await uploadOnCloudinary(backgroundPic);
        }

        console.log(req.body.backgroundPic, "req.body.backgroundPic");

        // Get the current user data
        const currentUser = await User.findById(userId);
        console.log(currentUser, "current")
        console.log("Request body:", req.body);
        console.log("Files received:", req.files);

        // Prepare data for update
        let updateData = {
            name,
            email,
        };



        // Handle the backgroundPic logic
        if (req.body.backgroundPic && (req.body.backgroundPic === null || req.body.backgroundPic === 'null')) {

            // User clicked on remove, use $unset to remove backgroundPic field from the document
            let data = await User.findByIdAndUpdate(userId, {
                $unset: { backgroundPic: "" }
            }, { new: true });

            console.log(data, "aaaaaaaaaaaaaaaaaaaaaaaaaaa")
        } else if (!req?.files?.backgroundPic && !req.body.backgroundPic) {
            // No new background uploaded, retain the current background picture
            cloudinarybgImage = { url: currentUser.backgroundPic };
            updateData.backgroundPic = cloudinarybgImage.url;
        } else if (cloudinarybgImage?.url) {
            // If a new background is uploaded, set it
            updateData.backgroundPic = cloudinarybgImage.url;
        }

        console.log(cloudinarybgImage, "cloudinarybgImage");


        // Update profile picture if provided
        if (cloudinaryImage?.url) {
            updateData.pic = cloudinaryImage.url;
        }

        // Update backgroundPic only if a new one is uploaded or if it's being removed
        if (cloudinarybgImage?.url || cloudinarybgImage === null) {
            updateData.backgroundPic = cloudinarybgImage?.url || null;
        }

        // Update user profile
        let userExist = await User.findByIdAndUpdate(
            userId,
            { $set: updateData },
            { new: true }
        );

        if (!userExist) {
            return errorRes(res, 400, "User did not exist");
        } else {
            return successRes(res, 201, "User profile updated successfully", userExist);
        }
    }



}