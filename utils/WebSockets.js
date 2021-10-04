
// models
const chatModel  = require('../models/Chats.js');

const { formatMessage, formatConversation } = require('../utils/messages');
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('../utils/users');
const UserModel = require("../models/User.js");

// create a web-socket class that will manage sockets for us
class WebSockets {

    // connection method takes in a parameter called client (client here will be our server instance => socket)
    connection(client) {
        // console.log('New WS Connection...');

        const botName = 'Odile Bot ';

        // when client join a room
        client.on('subscribe', async ({ username, room }) => {
            // add user to our users array
            const user = userJoin(client.id, username, room);

            // Keep messages after reloading the page
            // ...

            // add user to specific room
            client.join(user.room);

            /*
            // Welcome current user
            // 1- Emit a message to a single client
            client.emit(
                'message',
                formatMessage(botName, 'Welcome to Chat-Becode!')
            );

            // Broadcast when a user connects
            // 2- Emit for all clients except client connected : difference between socket.emit
            client.broadcast
                .to(user.room)  // emit message to a specific room
                .emit(
                    'message',
                    formatMessage(botName, `${user.username} has joined the chat`)
                );
            */

            // Send users and room info
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            });

            // Get all saved messages and send them to room
            const conversations = await chatModel.getConversationByRoomName(user.room);
            //console.log(`Successfully found ${conversations.length} documents.`);
            //console.log(conversations);
            if (conversations.length > 0) {
                // socket.emit('output', res);
                //io.to(user.room).emit('output', conversations);
                //client.emit('output', conversations);
                for (let i=0; i< conversations.length; i++) {
                    const message = conversations[i].message;
                    const postedByUser = conversations[i].postedByUser;
                    const createdAt = conversations[i].createdAt;
                    client.emit(
                        'conversation',
                        formatConversation(postedByUser, message, createdAt)
                    );
                }
            }

            // ******
            // Welcome current user
            // 1- Emit a message to a single client
            client.emit(
                'message',
                formatMessage(botName, 'Welcome to Chat-Becode!')
            );

            // Broadcast when a user connects
            // 2- Emit for all clients except client connected : difference between socket.emit
            client.broadcast
                .to(user.room)  // emit message to a specific room
                .emit(
                    'message',
                    formatMessage(botName, `${user.username} has joined the chat`)
                );
            // *****


        });

        // Listen for chatMessage
        client.on('chatMessage', async msg => {
            // console.log(msg);
            const user = getCurrentUser(client.id);
            // Send message to everybody who connected in the specific room
            io.to(user.room).emit(
                    'message',
                    formatMessage(user.username, msg)
                    // formatMessage(botName, `${user.username} has left the chat`)
                );
            // Insert message in chats collection
            const chat = await chatModel.createPostInChatRoom(user.room, msg, user.username);
        });

        // Run when client disconnects
        client.on('disconnect', () => {
            // remove user from our array
            const user = userLeave(client.id);

            if (user) {
                // remove user from a specific room
                client.leave(user.room);

                io.to(user.room).emit(
                    'message',
                    // formatMessage(botName, 'A user has left the chat')
                    formatMessage(botName, `${user.username} has left the chat`)
                );

                // Send users and room info
                io.to(user.room).emit('roomUsers', {
                    room: user.room,
                    users: getRoomUsers(user.room)
                });
            }

        });
    }

}

module.exports = new WebSockets();