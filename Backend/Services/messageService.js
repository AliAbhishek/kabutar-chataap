
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
            content, replyto, file: cloudinaryImage?.url
        }

        let message = await Message.create(data)

        message = await message.populate({ path: "sender", select: "-password" })
        message = await message.populate("chat")
        message = await User.populate(message, { path: "chat.users", select: "-password" })

        const chatUsers = await Chat.findById(chat).select('users');
        const otherUsers = chatUsers.users.filter(user => user.toString() !== req.user.userId);
        const update = {};
        const updateToSee = {};
        otherUsers.forEach(user => {
            update[`unreadMessageCounts.${user}`] = 1; // Increment for each other user
        });

        console.log(update, "update")

        let datawithcount = await Chat.findByIdAndUpdate(chat, {
            latestMessage: message,
            $inc: update
        }, { new: true });

        await Message.findByIdAndUpdate(
            message?._id,
            {
                $set: {
                    seenBy: updateToSee,
                    
                },
            },
            { new: true }
        );



        // Emit the new message to the chat room via socket
        global.io.emit("checkunread-count", {
            datawithcount,

        });



        return successRes(res, 200, "message send successfully", message)


    },
    allMessages: async (req, res) => {
        const { chatId } = req.params;
        const userId = req.user.userId

        // Find the messages and populate them before sending the response
        let data = await Message.find({ chat: chatId })


        // console.log(data, "data")

        if (!data) {
            return errorRes(res, 404, "No messages found for this chat");
        }



        // let read = await Message.updateMany(
        //     { chat: chatId, isRead: false, readBy: { $ne: userId } }, // Only update unread messages that haven't been read by this user
        //     { $addToSet: { readBy: userId }, $set: { isRead: true } } // Add user to readBy and set isRead to true
        // );





        await Chat.findByIdAndUpdate(chatId, {
            $set: { [`unreadMessageCounts.${userId}`]: 0 }
        }, { new: true });

        const bulkOps = data
            .map((message) => {
                // Only prepare an update if the message sender is not the current user
                if (message.sender.toString() !== userId) {
                    return {
                        updateOne: {
                            filter: { _id: message._id },
                            update: {
                                $set: {
                                    [`seenBy.${userId}`]: true, // Set the current user's seen status to true
                                },
                                $addToSet: {
                                    readBy: userId  // Add all other users to the readBy array
                                }
                            },
                        },
                    };
                }
                return null; // Ignore messages sent by the current user
            })
            .filter((op) => op); // Remove null entries

        // Perform bulk write operation if there are updates to be made
        if (bulkOps.length > 0) {
            await Message.bulkWrite(bulkOps);
        }

        const updatedMessages = await Message.find({
            _id: { $in: data.map((msg) => msg._id) }
        })

        global.io.emit("seenUnseen", {
            updatedMessages,

        });



        // await Message.updateMany(
        //     { chat: chatId, isRead: false }, // Only update unread messages that haven't been read by this user
        //     { $set: { isRead: true } }, { new: true }// Add user to readBy and set isRead to true
        // );

        global.io.emit("clearunread-count", {
            data,

        });



        data = await Message.find({ chat: chatId }).populate({ path: "sender", select: "-password" })
            .populate("chat").populate("replyto").populate({ path: "readBy", select: "-password" })





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