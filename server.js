require("dotenv").config();

const path = require('path');
const http = require('http');

const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');

const socketio = require('socket.io');


//const logger = require('morgan');
const cors = require('cors');

// mongo connection
const mongo = require('../config/mongo.js');

// socket configuration
const WebSockets = require('../utils/WebSockets.js');

// routes
const indexRouter = require('../routes/index.js');
//const userRouter = require('../routes/user.js');
//const chatRoomRouter = require('../routes/chatRoom.js');
//const deleteRouter = require('../routes/delete.js');

// controllers
const user = require('../controllers/user.js');

// models
const UserModel  = require('../models/User.js');

/** Get port from environment and store in Express. */
//const TWO_HOURS = 1000 * 60 * 60 * 2;
const {
    PORT = 3000,
    NODE_ENV = 'development',

    SESS_NAME = 'sid',
    SESS_SECRET = 'ssh!quiet,it)secret!'
    //SESS_LIFETIME = TWO_HOURS
} = process.env

const IN_PROD = NODE_ENV === 'production';


const app = express();
app.set("port", PORT);

// use session
app.use( session({
    name: SESS_NAME,
    resave : false,
    saveUninitialized: false,
    secret: SESS_SECRET,
    cookie: {
        //maxAge: SESS_LIFETIME,
        sameSite: true,
        secure: IN_PROD
    }
}));

// using ejs
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
//app.set('views', __dirname);
app.set('views', 'public');

//app.use(express.json());
app.use(bodyParser.json());
//app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({extended: true}));

// cookie parser middleware
//app.use(cookieParser());

//app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));

app.use("/", indexRouter);


/** catch 404 and forward to error handler */
app.use('*', (req, res) => {
    /*return res.status(404).json({
        success: false,
        message: 'API endpoint doesnt exist'
    })*/
    res.redirect('/404');
});


/** Create HTTP server. */
const server = http.createServer(app);

//global.io is equivalent to windows object in browser.
// But since we don't have windows in NodeJS we use global.io.
// Whatever we put in global.io is available in the entire application.

/** Create socket connection */
// assign global.io to socketio.listen(server)
// (As soon as a port starts listening on the server,
// sockets starts listening for events happening on that port as well.)

// Run when client connects
io = socketio(server);

// Every time someone from the front end makes a socket connection,
// the connection method will be called which will invoke our Websockets class
// and inside that class the connection method.
// global.io.on('connection', WebSockets.connection)
io.on('connection', WebSockets.connection)



/** Listen on provided port, on all network interfaces. */
server.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`)
});

