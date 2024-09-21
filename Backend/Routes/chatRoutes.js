import express from "express"

import auth from "../middlewares/UserAuthenticate.js"
import chatController from "../Controllers/chatController.js"
const chatRouter = express.Router()

chatRouter.use(auth)

chatRouter.post("/accessChat",chatController.accessChat)
chatRouter.get("/fetchChat",chatController.fetchChat)
chatRouter.post("/createGroup",chatController.createGroup)
chatRouter.put("/renameGroup",chatController.renameGroup)
chatRouter.put("/addToGroup",chatController.addToGroup)
chatRouter.put("/removeFromGroup",chatController.removeFromGroup)





export default chatRouter

