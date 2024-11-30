const express = require('express');
const fs = require('fs');
const path = require('path');

// Initialize a new router
const router = express.Router();

// Path to the tasks.json file
const TASKS_FILE = path.join(__dirname, '../task.json');

// Utility function to read and write to the task.json file
const readTasksFile = () => {
  if (!fs.existsSync(TASKS_FILE)) {
    fs.writeFileSync(TASKS_FILE, JSON.stringify([], null, 2));
  }
  const data = fs.readFileSync(TASKS_FILE, 'utf-8');
  return JSON.parse(data);
};

const writeTasksFile = (tasks) => {
  fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2));
};

// Add a task (POST /tasks)
router.post('/tasks', (req, res) => {
  try {
    const { username, title, description, deadline, priority } = req.body;

    // Read existing tasks
    const tasks = readTasksFile();

    // Create a new task object
    const newTask = {
      id: Date.now().toString(), // Unique ID for the task
      username,
      title,
      description,
      deadline,
      priority,
    };

    // Add the task to the array
    tasks.push(newTask);

    // Write the updated array back to task.json
    writeTasksFile(tasks);

    console.log('Task added successfully:', newTask);
    res.status(201).send('Task added successfully');
  } catch (error) {
    console.error('Error adding task:', error);
    res.status(500).send('Error adding task');
  }
});

// Get tasks for a user (GET /tasks/:username)
router.get('/tasks/:username', (req, res) => {
  try {
    const username = req.params.username;

    // Read tasks from file
    const tasks = readTasksFile();

    // Filter tasks for the specific user
    const userTasks = tasks.filter(task => task.username === username);

    res.status(200).json(userTasks);
  } catch (error) {
    console.error('Error retrieving tasks:', error);
    res.status(500).send('Error retrieving tasks');
  }
});

module.exports = router;
