
import uploadOnCloudinary from "../helpers/cloudinary.js"
import { errorRes, successRes } from "../helpers/response.js"
import Chat from "../Models/chatModel.js"
import Message from "../Models/messagesModel.js"
import User from "../Models/userModel.js"


export const messageService = {
    sendMessage: async (req, res) => {

        const { content, chat, replyto } = req.body
        // console.log(content,"content")
        // console.log(chat,"chat")
        // // const {file} = req.files
        // console.log(req.files,"file")
        // console.log(replyto, "rreeeppplllyyy")
        // if (!content || !file) {
        //     return errorRes(res, 400, "Please enter correct details")
        // }

        let cloudinaryImage
        if (req?.files?.file) {
            let image = req.files.file[0].path
             cloudinaryImage = await uploadOnCloudinary(image)
        }

        const data = {
            sender: req.user.userId,
            chat,
            content, replyto ,file:cloudinaryImage?.url
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
        const userId = req.user.userId

        // Find the messages and populate them before sending the response
        const data = await Message.find({ chat: chatId })
            .populate({ path: "sender", select: "-password" })
            .populate("chat").populate("replyto").populate({path:"readBy",select:"-password"})

        if (!data) {
            return errorRes(res, 404, "No messages found for this chat");
        }

      let read=  await Message.updateMany(
            { chat: chatId, isRead: false, readBy: { $ne: userId } }, // Only update unread messages that haven't been read by this user
            { $addToSet: { readBy: userId }, $set: { isRead: true } } // Add user to readBy and set isRead to true
        );

        console.log(read,"read")

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

        let updatedMessage = await Message.findByIdAndUpdate(messageId, { $set: { content: `Message deleted by ${user?.name} `, isDeleted: true } }, { new: true })
        return successRes(res, 200, "message deleted successfully", updatedMessage)

    }
}