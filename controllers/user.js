require("dotenv").config();

const bcrypt = require('bcryptjs');
//const jwt = require("jsonwebtoken");


// utils
const makeValidation = require('@withvoid/make-validation');

// models
const UserModel  = require('../models/User.js');


module.exports = {
    onGetAllUsers: async (req, res) => {
        try {
            const users = await UserModel.getUsers();
            return res.status(200).json({ success: true, users });
        } catch (error) {
            return res.status(500).json({ success: false, error: error })
        }
    },
    onGetUserById: async (req, res) => {
        try {
            const user = await UserModel.getUserById(req.params.id);
            //return res.json({ success: true, user });
            //return res.json({ user });
            //return user;
            return res.status(200).json({ success: true, user });
        } catch (error) {
            //return res.status(500).json({ success: false, error: error })
            return res.json({ status: 'error', error: error });
        }
    },
    onUserLogin: async (req, res) => {
        try {
            const validation = makeValidation(types => ({
                payload: req.body,
                checks: {
                    username: {type: types.string},
                    password: {type: types.string},
                    room: {type: types.string},
                }
            }));

            // check if login data are correct
            if (!validation.success) return res.json({ status: 'error', error: 'Invalid username/password' });

            // Get user input
            const { username, password, room } = req.body;

            // Validate if user exist in our database
            const user = await UserModel.findOne({ username });

            if (user && (await bcrypt.compare(password, user.password))) {
                // the username, password combination is successful

                // Create token
                const payload = {
                    id: user._id,
                    username: user.username,
                    room: room
                };
                /*const token = jwt.sign(payload, process.env.TOKEN_KEY);*/

                req.session.userId = user._id;
                req.session.username = user.username;
                req.session.room = room;
                //res.locals.user = payload;

                //return res.redirect('/chat');
                return res.json({ status: 'ok'});
            }

            // if login failed redirect to login page with message error
            // res.redirect('/login');
            return res.json({ status: 'error', error : 'Invalid username/password'});

        } catch (err) {
            console.log(err);
        }
    },
    onUserLogout: async (req, res) => {
        req.session.destroy((err) => {
            if(err) {
                //return console.log(err);
                return res.redirect('/chat');
            }


            res.clearCookie(process.env.SESS_NAME);
            res.redirect('/login');
        });
    },
    onCreateUser: async (req, res) => {
        // console.log(req.body);
        // return res.json({ status: 'ok' });
        try {
            const validation = makeValidation(types => ({
                payload: req.body,
                checks: {
                    username: {type: types.string},
                    password: {type: types.string},
                }
            }));

            // check if register data are correct
            if (!validation.success) return res.json({ status: 'error', error: 'Username and Password must be string' });

            // Get requested data from body
            const { username, password } = req.body;

            //Encrypt user password
            const encryptedPassword = await bcrypt.hash(password, 10);
            const user = await UserModel.createUser(username, encryptedPassword);

            //req.session.userId = user._id;
            //return res.redirect('/chat'); // here you can send username with url like
            return res.json({ status: 'ok' });

        } catch (error) {
            if (error.code === 11000) {
                // duplicate key
                return res.json({ status: 'error', error: 'Username already in use' })
            }
            throw error
        }
    },
    onDeleteUserById: async (req, res) => {
        try {
            const user = await UserModel.deleteByUserById(req.params.id);
            return res.status(200).json({
                success: true,
                message: `Deleted a count of ${user.deletedCount} user.`
            });
        } catch (error) {
            return res.status(500).json({ success: false, error: error })
        }
    },
}