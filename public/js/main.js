const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// Get username and room from URL
//const { username, room } = Qs.parse(location.search, {
//    // Ignore special character in the url
//    ignoreQueryPrefix: true,
//});

console.log(username);
console.log(room);

// console.log(username, room);

//const socket = io();
// const socket = io('http://localhost:3000');
const socket = io();

// Join chatroom
socket.emit('subscribe', { username, room });

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
});

// Get Message from server
socket.on('message', (message) => {
    // console.log(message);
    outputMessage(message);

    // Scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
});
// Get Old Conversation from server
socket.on('conversation', (oldConversation) => {
    // console.log(message);
    outputOldMessage(oldConversation);

    // Scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Get Old conversations from server
/*socket.on('output', (conversations) => {
    // console.log(conversations);
    for (let i=0; i< conversations.length; i++) {
        outputOldMessage(conversations[i]);
    }

    // Scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
});*/

// Message submit from chat-form form
chatForm.addEventListener('submit', (e) => {
    // prevent default not display a file
    // don't refresh the page
    e.preventDefault();

    // Get message text
    let msg = e.target.elements.msg.value;

    msg = msg.trim();

    if (!msg) {
        return false;
    }

    // Emit message to server
    socket.emit('chatMessage', msg);

    // Clear input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});

// Output message to DOM
function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    const p = document.createElement('p');
    // console.log(message.username);
    if (message.username === 'Odile Bot ') {
        p.classList.add('bot');
    } else {
        p.classList.add('meta');
    }

    p.innerText = message.username;
    p.innerHTML += `<span>${message.time}</span>`;
    div.appendChild(p);
    const para = document.createElement('p');
    para.classList.add('text');
    para.innerText = message.text;
    div.appendChild(para);
    document.querySelector('.chat-messages').appendChild(div);
}

// Add room name to DOM
function outputRoomName(room) {
    roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
    /*userList.innerHTML = '';
    users.forEach((user) => {
        const li = document.createElement('li');
        li.innerText = user.username;
        userList.appendChild(li);
    });*/
    userList.innerHTML = `
        ${users.map(user => `<li>${user.username}</li>`).join('')}
        `;
}

// Output old message to DOM
function outputOldMessage(oldConversation) {
    const div = document.createElement('div');
    div.classList.add('message');
    const p = document.createElement('p');
    p.classList.add('meta');

    p.innerText = oldConversation.username; //oldConversation.postedByUser;
    p.innerHTML += ` <span>${oldConversation.date}</span>`;
    p.innerHTML += ` <span>${oldConversation.time}</span>`;
    div.appendChild(p);
    const para = document.createElement('p');
    para.classList.add('text');
    para.innerText = oldConversation.text; //oldConversation.message;
    div.appendChild(para);
    document.querySelector('.chat-messages').appendChild(div);
}

