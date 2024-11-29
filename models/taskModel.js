const mongoose = require('mongoose');

// User Schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

// Task Schema
const taskSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String },
    deadline: { type: Date, required: true },
    priority: { type: String, enum: ['low', 'medium', 'high'], required: true },
    completed: { type: Boolean, default: false },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
const Task = mongoose.model('Task', taskSchema);

module.exports = { User, Task };
