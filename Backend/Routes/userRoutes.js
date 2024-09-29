import express from "express"
import userController from "../Controllers/userControllers.js"
import upload from "../middlewares/multer.js"
import auth from "../middlewares/UserAuthenticate.js"
const userRouter = express.Router()

userRouter.post("/registration",upload.fields([{name:"pic",maxCount:1}]), userController.registration)
userRouter.post("/login",userController.login)


userRouter.use(auth)
userRouter.get("/",userController.search)
userRouter.put("/editProfile",upload.fields([{name:"pic",maxCount:1}]),userController.editProfile)



export default userRouter

