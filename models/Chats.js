const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

/*
const MESSAGE_TYPES = {
    TYPE_TEXT: "text",
};
*/
const MESSAGE_TYPES = require('../models/MessageType.js');


const chatMessageSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            default: () => uuidv4().replace(/\-/g, ""),
        },
        chatRoomName: String,
        message: mongoose.Schema.Types.Mixed,
        type: {
            type: String,
            default: () => MESSAGE_TYPES.TYPE_TEXT,
        },
        postedByUser: String,
    },
    {
        timestamps: true,
        collection: "chats",
    }
);

chatMessageSchema.statics.createPostInChatRoom = async function (chatRoomName, message, postedByUser) {
    try {
        const post = await this.create({
            chatRoomName,
            message,
            postedByUser,
            // readByRecipients: { readByUserId: postedByUser }
        });

        return post;

    } catch (error) {
        throw error;
    }
}

chatMessageSchema.statics.getConversationByRoomName = async function(chatRoomName) {
    const query = { "chatRoomName": chatRoomName };
    //console.log(`Successfully found ${items.length} documents.`);
    return await this.find(query);
}

module.exports = mongoose.model("ChatMessage", chatMessageSchema);