const mongoose = require('mongoose');

// Define the user schema
const userSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true, 
        unique: true, // Ensure that usernames are unique
    },
    password: { 
        type: String, 
        required: true 
    }
}, {
    timestamps: true // Automatically add createdAt and updatedAt fields
});

// Create the User model
const User = mongoose.model('User', userSchema);

// Export the user model
module.exports = User;