// utils
const makeValidation = require('@withvoid/make-validation');

// models
const ChatRoomModel  = require('../models/ChatRoom.js');
const CHAT_ROOM_TYPES = require('../models/ChatRoomType.js');
const ChatMessageModel  = require('../models/ChatMessage.js');

module.exports = {
    initiate: async (req, res) => {
        try {
            const validation = makeValidation(types => ({
                payload: req.body,
                checks: {
                    userIds: {
                        type: types.array,
                        options: { unique: true, empty: false, stringOnly: true }
                    },
                    type: { type: types.enum, options: { enum: CHAT_ROOM_TYPES } },
                }
            }));
            if (!validation.success) return res.status(400).json({ ...validation });

            const { userIds, type } = req.body;

            const { userId: chatInitiator } = req;
            const allUserIds = [...userIds, chatInitiator];

            // call our initiateChat method from ChatRoomModel and pass it allUserIds, type, chatInitiator
            const chatRoom = await ChatRoomModel.initiateChat(allUserIds, type, chatInitiator);
            return res.status(200).json({ success: true, chatRoom });
        } catch (error) {
            return res.status(500).json({ success: false, error: error })
        }
    },
    postMessage: async (req, res) => {
        try {
            const { roomId } = req.params;
            const validation = makeValidation(types => ({
                payload: req.body,
                checks: {
                    messageText: { type: types.string },
                }
            }));
            if (!validation.success) return res.status(400).json({ ...validation });

            const messagePayload = {
                messageText: req.body.messageText,
            };
            const currentLoggedUser = req.userId;
            const post = await ChatMessageModel.createPostInChatRoom(roomId, messagePayload, currentLoggedUser);
            // io.to(user.room).emit('message', formatMessage(user.username, msg));
            global.io.sockets.in(roomId).emit('new message', { message: post });
            return res.status(200).json({ success: true, post });
        } catch (error) {
            return res.status(500).json({ success: false, error: error })
        }
    },
    getRecentConversation: async (req, res) => { return res.status(200).json({ success: true }); },
    getConversationByRoomId: async (req, res) => { },
    markConversationReadByRoomId: async (req, res) => { },
}