const express = require('express');

// controllers
const user = require('../controllers/user.js');

const router = express.Router();

router
    //.get('/', user.onGetAllUsers)
    //.get('/login', user.onUserLogin)
    .post('/login', user.onUserLogin)
    //.get('/register', user.onCreateUser)
    .post('/register', user.onCreateUser)
    .post('/logout', user.onUserLogout)
    //.get('/:id', user.onGetUserById)
    //.delete('/:id', user.onDeleteUserById)

module.exports = router;
