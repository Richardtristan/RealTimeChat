const express = require('express');
const path = require('path');

// controllers
const user = require('../controllers/user.js');

// models
//const UserModel  = require('../models/User.js');

// middlewares
const { redirectLogin, redirectChat } = require('../middlewares/jwt.js');

const router = express.Router();


/*router.use('*', async function(req, res, next) {
    //const { userId } = req.params;
    //const user = await UserModel.getUserById(userId);
    //const { userId } = req.session.userId
    if (req.session) {
        const { userId } = req.session.userId
        const user = await UserModel.getUserById(userId)
        res.locals.user = user
    }
    next()
})
*/

router
    .get('/', (req, res) => {
        const { userId } = req.session;
        if (userId) {
            //res.redirect(`/chat.html?username=${username}&room=${room}`);
            res.redirect('/chat')
        }
        else {
            res.sendFile('login.html', { root: './public' });
        }
    })
    .get('/chat', redirectLogin, (req, res) => {
        const { username, room } = req.session
        res.redirect(`/chat.html?username=${username}&room=${room}`);

    })
    .get('/login', redirectChat, (req, res) => {
        res.sendFile('login.html', { root: './public' });
    })
    .get('/register', redirectChat, (req, res) => {
        res.sendFile('register.html', { root: './public' });
    })
    .get('/404', (req, res) => {
        res.sendFile('404.html', { root: './public' });
    })
    .post('/login', redirectChat, user.onUserLogin)
    .post('/register', redirectChat, user.onCreateUser)
    .post('/logout', redirectLogin, user.onUserLogout)

    //.post('/login/:userId', user.onGetUserById) //(req, res) => {
      //return res.status(200).json({success: true,data: user});
    //})
    /*.get('/login/:userId', (req, res, next) => {

    });*/


module.exports = router;
