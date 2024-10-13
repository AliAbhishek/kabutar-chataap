import mongoose from "mongoose";

const messageSchema = mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: { type: String, trim: true },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    isEdited: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    replyto: { type: mongoose.Schema.Types.ObjectId, ref: "Message", default: null },
    file: { type: String, default: null },
    isRead:{type:Boolean,default:false},
    seenBy:{
      type: Map,
      of: Number,
      default: {}
    },
    reaction:{
     type:String,
     default:null
    }

  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);
export default Message