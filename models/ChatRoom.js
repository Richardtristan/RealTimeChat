const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

/*
export const CHAT_ROOM_TYPES = {
    CONSUMER_TO_CONSUMER: "consumer-to-consumer",
    CONSUMER_TO_SUPPORT: "consumer-to-support",
};
*/
const chatRoomSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            default: () => uuidv4().replace(/\-/g, ""),
        },
        userIds: Array,
        type: String,
        chatInitiator: String,
    },
    {
        timestamps: true,
        collection: "chatrooms",
    }
);

// This function takes in three parameters:
//   userIds (array of users)
//   type (type of chatroom)
//   chatInitiator (the user who created the chat room)
chatRoomSchema.statics.initiateChat = async function ( userIds, type, chatInitiator ) {
    try {
        // The $size operator matches any array with the number of elements specified by the argument
        // expl : db.collection.find( { field: { $size: 2 } } )
        // returns all documents in collection where field is an array with 2 elements.
        // the above expression will return { field: [ red, green ] } and { field: [ apple, lime ] }
        // but not { field: fruit } or { field: [ orange, lemon, grapefruit ] }

        // The $all operator selects the documents where the value of a field is an array that contains
        // all the specified elements.
        // To specify an $all expression, use the following prototype:
        // { <field>: { $all: [ <value1> , <value2> ... ] } }
        const availableRoom = await this.findOne({
            userIds: {
                $size: userIds.length,   // check all userid with 2 items
                $all: [...userIds],      // check if all userIds is the same in userIds.length
            },
            type,
        });
        if (availableRoom) {
            return {
                isNew: false,
                message: 'retrieving an old chat room',
                chatRoomId: availableRoom._doc._id,
                type: availableRoom._doc.type,
            };
        }

        const newRoom = await this.create({ userIds, type, chatInitiator });
        return {
            isNew: true,
            message: 'creating a new chatroom',
            chatRoomId: newRoom._doc._id,
            type: newRoom._doc.type,
        };
    } catch (error) {
        console.log('error on start chat method', error);
        throw error;
    }
}

module.exports = mongoose.model("ChatRoom", chatRoomSchema);