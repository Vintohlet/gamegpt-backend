import mongoose from "mongoose";
const chatSchema = new mongoose.Schema({
    chatName:{
      type: String,
      required:true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', 
      required: true,
    },
    messages: [
      {
        sender: {
          type: String,
          enum: ['user', 'assistant'], 
          required: true,
        },
        text: {
          type: String,
          required: true,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  }, {
    timestamps: true 
  });
  export const Chat = mongoose.model("Chat", chatSchema)