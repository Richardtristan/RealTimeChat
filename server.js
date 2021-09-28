const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'Odile Bot ';

// Run when client connects
io.on('connection', socket => {
    // console.log('New WS Connection...');

    socket.on('joinRoom', ({ username, room }) => {
        const user = userJoin(socket.id, username, room);

        socket.join(user.room);

        // Welcome current user
        // 1- Emit a message to a single client
        socket.emit(
            'message',
            formatMessage(botName, 'Welcome to Chat-Becode!')
        );

        // Broadcast when a user connects
        // 2- Emit for all clients excepet client connected : difference between socket.emit
        socket.broadcast
            .to(user.room)
            .emit(
            'message',
                formatMessage(botName, `${user.username} has joined the chat`)
            );

        // Send users and room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });

    });

    /* those 2 functions are inside joinRoom socket.on
    // Welcome current user
    // 1- Emit a message to a single client
    socket.emit('message', formatMessage(botName, 'Welcome to Chat-Becode!'));

    // Broadcast when a user connects
    // 2- Emit for all clients excepet client connected : difference between socket.emit
    socket.broadcast.emit('message', formatMessage(botName, 'A user has joined the chat'));
    */

    // 3- send message for all clients
    //io.emit()

    // Listen for chatMessage
    socket.on('chatMessage', msg => {
       //console.log(msg);
        const user = getCurrentUser(socket.id);
       // Send message to everybody who connected
        io.to(user.room).emit('message', formatMessage(user.username, msg));
    });

    // Run when client disconnect
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);

        if(user) {
            io.to(user.room).emit(
                'message',
                formatMessage(botName, `${user.username} has left the chat`)
            );

            // Send users and room info
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            });
        }
        //io.emit('message', formatMessage(botName, 'A user has left the chat'));
    });

});

const PORT = 3000; // || process.env.PORT;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`)
})