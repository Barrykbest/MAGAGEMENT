const mongoose = require('mongoose');

// Connect to the MongoDB database
mongoose.connect('mongodb://localhost:27017/taskmaster')
mongoose.connect('mongodb+srv://barrykbest:TaskMasterDatabase@taskmaster.7zdug.mongodb.net/taskmaster')


    .then(() => {
        console.log('Database connected successfully');
    })
    .catch((err) => {
        console.error('Database connection error:', err);
    });

// Create a schema for the login data
const loginSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true // Ensures each user name is unique
    },
    password: {
        type: String,
        required: true
    }
});

// Create a Mongoose model for the Users collection
const collection = mongoose.model('Users', loginSchema);

module.exports = collection;
