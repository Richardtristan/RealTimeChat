const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

/*
const USER_TYPES = {
    CONSUMER: "consumer",
    SUPPORT: "support",
};
*/

const userSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            default: () => uuidv4().replace(/\-/g, ""),  // will get random string by default using uuidv4
        },
        username: { type: String, required: true, unique: true },
        password: { type: String, required: true },
    },
    {
        // Setting timestamps to true will add 2 things to my schema: a createdAt and a updatedAt date value
        timestamps: true,
        // This shows what my collection name will be inside my chatapp database
        collection: "users",
    }
);

// using performing operations on the userSchema object
// Attention: won't work. If you use an => (array function) because we can't use a key : this
userSchema.statics.createUser = async function (
    username,
    password,
) {
    try {
        const user = await this.create({ username, password });
        return user;
    } catch (error) {
        throw error;
    }
};

userSchema.statics.getUserById = async function (id) {
    try {
        const user = await this.findOne({ _id: id });
        if (!user) throw ({ error: 'No user with this id found' });
        return user;
    } catch (error) {
        throw error;
    }
};

userSchema.statics.getUsers = async function () {
    try {
        const users = await this.find();
        return users;
    } catch (error) {
        throw error;
    }
};

userSchema.statics.deleteByUserById = async function (id) {
    try {
        const result = await this.remove({ _id: id });
        return result;
    } catch (error) {
        throw error;
    }
}

// export the objects
// module.exports = USER_TYPES;

// mongoose.model takes in 2 parameters
// The name of the model, which is User here
// The schema associated with that model, which is userSchema in this case
module.exports = mongoose.model("User", userSchema);
