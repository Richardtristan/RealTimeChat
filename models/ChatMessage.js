const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

/*
const MESSAGE_TYPES = {
    TYPE_TEXT: "text",
};
*/
const MESSAGE_TYPES = require('../models/MessageType.js');

const readByRecipientSchema = new mongoose.Schema(
    {
        _id: false,
        readByUserId: String,
        readAt: {
            type: Date,
            default: Date.now(),
        },
    },
    {
        timestamps: false,
    }
);

const chatMessageSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            default: () => uuidv4().replace(/\-/g, ""),
        },
        chatRoomId: String,
        message: mongoose.Schema.Types.Mixed,
        type: {
            type: String,
            default: () => MESSAGE_TYPES.TYPE_TEXT,
        },
        postedByUser: String,
        readByRecipients: [readByRecipientSchema],
    },
    {
        timestamps: true,
        collection: "chatmessages",
    }
);

chatMessageSchema.statics.createPostInChatRoom = async function (chatRoomId, message, postedByUser) {
    try {
        const post = await this.create({
            chatRoomId,
            message,
            postedByUser,
            readByRecipients: { readByUserId: postedByUser }
        });

        return post;
    } catch (error) {
        throw error;
    }
}

module.exports = mongoose.model("ChatMessage", chatMessageSchema);