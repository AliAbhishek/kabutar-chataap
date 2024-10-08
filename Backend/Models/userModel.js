import mongoose from "mongoose";


const userSchema = mongoose.Schema(
  {
    name: { type: "String", required: true },
    email: { type: "String", unique: true, required: true },
    password: { type: "String", required: true },
    pic: {
      type: "String",
      
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
    backgroundPic:{
      type: "String",
      default:null
    },
    isOnline:{
      type:Number,
      default:0,
      description:"0-not online 1-online"
    },
    isActive:{
      type:Number,
      default:1,
      description:"1-active 2-deactive"
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    
    deviceToken:{type:"String",required: false}
  },
  { timestaps: true }
);



const User = mongoose.model("User", userSchema);

export default User