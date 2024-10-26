const taskForm = document.getElementById('taskForm');
const taskList = document.getElementById('taskList');
document.addEventListener('DOMContentLoaded', loadTasks);
taskForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const title = document.getElementById('taskTitle').value;
    const description = document.getElementById('taskDescription').value;
    addTask(title, description);
});

async function loadTasks() {
    const response = await fetch('http://localhost:8000/api.php');
    const tasks = await response.json();
    renderTasks(tasks);
}

async function addTask(title, description) {
    const task = { title, description, status: 'pending' };
    const response = await fetch('http://localhost:8000/api.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(task),
    });
    await loadTasks(); 
}

async function completeTask(id) {
    await fetch(`http://localhost:8000/api.php?id=${id}&status=completed`, {
        method: 'PUT',
    });
    await loadTasks(); 
}

async function deleteTask(id) {
    await fetch(`http://localhost:8000/api.php?id=${id}`, {
        method: 'DELETE',
    });
    await loadTasks(); 
}

function renderTasks(tasks) {
    taskList.innerHTML = '';
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${task.title} - ${task.status}</span>
            <div>
                <button onclick="completeTask(${task.id})">Completar</button>
                <button class="delete" onclick="deleteTask(${task.id})">Eliminar</button>
            </div>
        `;
        taskList.appendChild(li);
    });
}