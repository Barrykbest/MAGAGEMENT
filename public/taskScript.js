const userId = "currentUserId"; // Replace with actual userId from session or auth

document.getElementById('add-task-btn').addEventListener('click', async () => {
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const deadline = document.getElementById('deadline').value;
    const priority = document.getElementById('priority').value;

    try {
        const response = await fetch('/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, title, description, deadline, priority }),
        });
        const data = await response.json();
        alert(data.message);
        fetchTasks();
    } catch (error) {
        console.error('Error adding task:', error);
    }
});

async function fetchTasks() {
    try {
        const response = await fetch(`/tasks/${userId}`);
        const tasks = await response.json();
        renderTasks(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
    }
}

function renderTasks(tasks) {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';
    tasks.forEach(task => {
        const taskItem = document.createElement('li');
        taskItem.innerHTML = `
            <strong>${task.title}</strong> (${task.priority})<br>
            ${task.description}<br>
            Due: ${new Date(task.deadline).toLocaleDateString()}<br>
            <button onclick="deleteTask('${task._id}')">Delete</button>
            <button onclick="updateTask('${task._id}')">Update</button>
        `;
        taskList.appendChild(taskItem);
    });
}

async function deleteTask(taskId) {
    try {
        await fetch(`/tasks/${taskId}`, { method: 'DELETE' });
        fetchTasks();
    } catch (error) {
        console.error('Error deleting task:', error);
    }
}

// Fetch tasks initially
fetchTasks();
