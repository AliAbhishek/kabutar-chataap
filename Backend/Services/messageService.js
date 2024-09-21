
import { errorRes, successRes } from "../helpers/response.js"
import Chat from "../Models/chatModel.js"
import Message from "../Models/messagesModel.js"
import User from "../Models/userModel.js"


export const messageService = {
    sendMessage: async (req, res) => {

        const { content, chat } = req.body
        if (!content || !chat) {
            return errorRes(res, 400, "Please enter correct ddetails")
        }

        const data = {
            sender: req.user.userId,
            chat,
            content
        }

        let message = await Message.create(data)

        message = await message.populate({ path: "sender", select: "-password" })
        message = await message.populate("chat")
        message = await User.populate(message, { path: "chat.users", select: "-password" })


        await Chat.findByIdAndUpdate(chat, {
            latestMessage: message
        })

        return successRes(res, 200, "message send successfully", message)


    },
    allMessages: async (req, res) => {
        const { chatId } = req.params;

        // Find the messages and populate them before sending the response
        const data = await Message.find({ chat: chatId })
            .populate({ path: "sender", select: "-password" })
            .populate("chat");

        if (!data) {
            return errorRes(res, 404, "No messages found for this chat");
        }

        return successRes(res, 200, "Messages fetched successfully", data);


    },
    editMessage: async (req, res) => {
        const { messageId, content } = req.body
        if (!messageId) {
            return errorRes(res, 400, "Please give message Id")

        }

        let updatedMessage = await Message.findByIdAndUpdate(messageId, { $set: { content, isEdited: true } }, { new: true })
        return successRes(res, 200, "message updated successfully", updatedMessage)

    },
    deleteMessage: async (req, res) => {
        const { messageId } = req.body
        if (!messageId) {
            return errorRes(res, 400, "Please give message Id")

        }
        const userId = req.user?.userId
        const user = await User.findById(userId)

        let updatedMessage = await Message.findByIdAndUpdate(messageId, { $set: { content: `Message deleted by ${user?.name} `,isDeleted:true } }, { new: true })
        return successRes(res, 200, "message deleted successfully", updatedMessage)

    }
}