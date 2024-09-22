import express from "express"
import messageController from "../Controllers/messageCongtroller.js"
import auth from "../middlewares/UserAuthenticate.js"
import upload from "../middlewares/multer.js"

const messageRouter = express.Router()

messageRouter.use(auth)

messageRouter.post("/",upload.fields([{name:"file",maxCount:1}]),messageController.sendMessage)
messageRouter.get("/:chatId",messageController.allMessages)
messageRouter.put("/editMessage",messageController.editMessage)
messageRouter.put("/deleteMessage",messageController.deleteMessage)






export default messageRouter

