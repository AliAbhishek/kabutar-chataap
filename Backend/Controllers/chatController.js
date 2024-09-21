import { errorRes } from "../helpers/response.js"
import { chatService } from "../Services/chatService.js"


const chatController={
    accessChat: async (req, res) => {
        try {
            const data = await chatService.accessChat(req, res)

        } catch (error) {
            errorRes(res, 500, error.message)

        }

    },
    fetchChat: async (req, res) => {
        try {
            const data = await chatService.fetchChat(req, res)

        } catch (error) {
            errorRes(res, 500, error.message)

        }

    },

    createGroup:async(req,res)=>{
        try {
            const data = await chatService.createGroup(req, res)

        } catch (error) {
            errorRes(res, 500, error.message)

        }
    },
    renameGroup:async(req,res)=>{
        try {
            const data = await chatService.renameGroup(req, res)

        } catch (error) {
            errorRes(res, 500, error.message)

        }
    },
    addToGroup:async(req,res)=>{
        try {
            const data = await chatService.addToGroup(req, res)

        } catch (error) {
            errorRes(res, 500, error.message)

        }
    },
    removeFromGroup:async(req,res)=>{
        try {
            const data = await chatService.removeFromGroup(req, res)

        } catch (error) {
            errorRes(res, 500, error.message)

        }
    },
}

export default chatController