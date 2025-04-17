import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userName:{
        type: String,
        required: true,
        trim: true
    },
    email:{
        type: String,
        required: true,
        trim: true,
    },
    password:{
        type: String,
        required:true
    },
    chats:{
        type: [mongoose.Schema.Types.ObjectId],
        ref:"Chat"
    }
})
export const User = mongoose.model("User", userSchema)