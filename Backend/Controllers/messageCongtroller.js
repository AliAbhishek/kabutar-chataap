import { errorRes } from "../helpers/response.js"
import { messageService } from "../Services/messageService.js"


const messageController = {
    sendMessage: async (req, res) => {
        try {
            const data = await messageService.sendMessage(req, res)

        } catch (error) {
            errorRes(res, 500, error.message)

        }

    },
    allMessages: async (req, res) => {
        try {
            const data = await messageService.allMessages(req, res)

        } catch (error) {
            errorRes(res, 500, error.message)

        }

    },
    editMessage:async (req, res) => {
        try {
            const data = await messageService.editMessage(req, res)

        } catch (error) {
            errorRes(res, 500, error.message)

        }

    },
    deleteMessage:async (req, res) => {
        try {
            const data = await messageService.deleteMessage(req, res)

        } catch (error) {
            errorRes(res, 500, error.message)

        }

    },

}

export default messageController