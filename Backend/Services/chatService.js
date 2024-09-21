import { users } from "moongose/models/index.js"
import { errorRes, successRes } from "../helpers/response.js"
import Chat from "../Models/chatModel.js"



export const chatService = {
    accessChat: async (req, res) => {
        const { chatWithUserId } = req.body

        console.log(req.user.userId,chatWithUserId)
        if (!chatWithUserId) {
            return errorRes(res, 400, "Please give id")

        }

        let isChatExist = await Chat.find({
            isGroupChat: false,
            $and: [
                { users: { $elemMatch: { $eq: chatWithUserId } } },
                { users: { $elemMatch: { $eq: req.user.userId } } },
            ]
        }).populate("users").populate("latestMessage")

        console.log(isChatExist, "chat")
        if (isChatExist.length > 0) {
            return successRes(res, 200, "chat found", isChatExist[0])
        }


        if (isChatExist.length == 0) {
            let chatData = {
                chatName: "sender",
                isGroupChat: false,
                users: [req.user.userId, chatWithUserId]
            }

            try {
                let chat = await Chat.create(chatData)
                let fullchat = await Chat.findOne({ _id: chat?._id }).populate("users")
                return successRes(res, 201, "Chat created successfully", fullchat)
            } catch (error) {
                return errorRes(res, 400, "Error in found chat")
            }

        }

    },
    fetchChat: async (req, res) => {
        const userId = req.user?.userId

        const chats = await Chat.find({ users: { $elemMatch: { $eq: userId } } }).populate("users").populate("latestMessage").populate("groupAdmin").sort({ updatedAt: -1 })


        if (!chats) {
            return errorRes(res, 400, "Chats can not fetched successfully")


        } else {
            return successRes(res, 201, "Chats fetched successfully",chats)
        }
    },
    createGroup: async (req, res) => {
        const { users, chatName } = req.body

        let finalArr = users.push(req.user.userId)
        let result = { users, chatName, isGroupChat: true, groupAdmin: req.user.userId }
        let data = await Chat.create(result)

        let groupData = await Chat.find({ _id: data?._id }).populate("users").populate("latestMessage").populate("groupAdmin")
        if (groupData) {
            return successRes(res, 201, "Members added successfully", groupData)
        } else {
            return errorRes(res, 400, "Error while adding member")
        }

    },
    renameGroup: async (req, res) => {
        const { groupId, chatName } = req.body

        if (!groupId) {
            return errorRes(res, 400, "Please give group Id")
        }
        let groupData = await Chat.findByIdAndUpdate(groupId, {
            $set: {
                chatName
            }
        }, { new: true }).populate("users").populate("latestMessage").populate("groupAdmin")

        if (groupData) {
            successRes(res, 201, "Name updated successfully", groupData)
        } else {
            return successRes(res, 201, "Something went wrong")
        }

    },
    addToGroup: async (req, res) => {
        const { groupId, userId } = req.body
        if (!groupId) {
            return errorRes(res, 400, "Please give group Id")
        }
        let groupData = await Chat.findByIdAndUpdate(groupId, {
            $push: {
                users: userId
            }
        }, { new: true }).populate("users").populate("latestMessage").populate("groupAdmin")

        
        if (groupData) {
            successRes(res, 201, "Member added successfully", groupData)
        } else {
            return successRes(res, 201, "Something went wrong")
        }


    },
    removeFromGroup: async (req, res) => {
        const { groupId, userId } = req.body
        if (!groupId) {
            return errorRes(res, 400, "Please give group Id")
        }
        let groupData = await Chat.findByIdAndUpdate(groupId, {
            $pull: {
                users: userId
            }
        }, { new: true }).populate("users").populate("latestMessage").populate("groupAdmin")

        
        if (groupData) {
            successRes(res, 201, "Member removed successfully", groupData)
        } else {
            return successRes(res, 201, "Something went wrong")
        }


    }
}