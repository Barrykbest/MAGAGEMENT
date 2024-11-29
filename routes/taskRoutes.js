const express = require('express');
const Task = require('../models/taskModel');

const router = express.Router();

// Create a task
router.post('/create', async (req, res) => {
    const { title, description, deadline, priority, userId } = req.body;
    try {
        const newTask = new Task({ title, description, deadline, priority, userId });
        await newTask.save();
        res.status(201).json(newTask); // Respond with the created task
    } catch (err) {
        res.status(400).json({ error: 'Error creating task' });
    }
});

// Get all tasks for a user
router.get('/', async (req, res) => {
    const { userId } = req.query;
    try {
        const tasks = await Task.find({ userId });
        res.status(200).json(tasks);
    } catch (err) {
        res.status(400).json({ error: 'Error fetching tasks' });
    }
});

// Update task
router.put('/update/:id', async (req, res) => {
    const { id } = req.params;
    const { title, description, deadline, priority } = req.body;
    try {
        const updatedTask = await Task.findByIdAndUpdate(
            id,
            { title, description, deadline, priority },
            { new: true }
        );
        res.status(200).json(updatedTask);
    } catch (err) {
        res.status(400).json({ error: 'Error updating task' });
    }
});

// Delete task
router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await Task.findByIdAndDelete(id);
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (err) {
        res.status(400).json({ error: 'Error deleting task' });
    }
});

module.exports = router;
