import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    user: {
        type: String
    },
    message: {
        type: String
    }
}, {timestamps: true})

export const chatModel = mongoose.model('Chat', chatSchema)