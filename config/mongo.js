const mongoose = require('mongoose');
const config = require('./index.js');

const CONNECTION_URL = `mongodb://${config.db.url}/${config.db.name}`

// mongoose connection
mongoose.connect(CONNECTION_URL, {
    // tells mongoose to use the new parser by Mongo
    // If it's set to true, we have to provide a database port in the CONNECTION_URL
    useNewUrlParser: true,
    // using MongoDB driver's new connection management engine
    useUnifiedTopology: true
});

// mongoose event handlers

//will be called once the database connection is established
mongoose.connection.on('connected', () => {
    console.log('Mongo has connected successfully');
});

// will be called when your Mongo connection is disabled
mongoose.connection.on('reconnected', () => {
    console.log('Mongo has reconnected');
});

// is called if there is an error connecting to your Mongo database
mongoose.connection.on('error', error => {
    console.log('Mongo connection has an error', error);
    mongoose.disconnect();
});

// event is called when the database loses connection and then makes an attempt to successfully reconnect.
mongoose.connection.on('disconnected', () => {
    console.log('Mongo connection is disconnected');
})
