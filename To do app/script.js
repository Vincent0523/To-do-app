// DOM elements
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const filters = document.querySelectorAll('.filter');
const clearCompletedBtn = document.getElementById('clear-completed');
const pendingTasksCount = document.getElementById('pending-tasks');

// Task array to store all tasks
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Current filter (all, pending, completed)
let currentFilter = 'all';

// Initialize app
function init() {
    renderTasks();
    updateTasksCount();
    
    // Event listeners
    taskForm.addEventListener('submit', addTask);
    taskList.addEventListener('click', handleTaskClick);
    clearCompletedBtn.addEventListener('click', clearCompleted);
    
    // Filter event listeners
    filters.forEach(filter => {
        filter.addEventListener('click', () => {
            // Set active filter
            document.querySelector('.filter.active').classList.remove('active');
            filter.classList.add('active');
            
            // Update current filter
            currentFilter = filter.getAttribute('data-filter');
            
            // Re-render tasks based on filter
            renderTasks();
        });
    });
}

// Add new task
function addTask(e) {
    e.preventDefault();
    
    const taskText = taskInput.value.trim();
    
    if (taskText) {
        // Create new task object
        const task = {
            id: Date.now(),
            text: taskText,
            completed: false,
            createdAt: new Date()
        };
        
        // Add to tasks array
        tasks.push(task);
        
        // Save to localStorage
        saveTasks();
        
        // Render tasks
        renderTasks();
        
        // Update task count
        updateTasksCount();
        
        // Clear input
        taskInput.value = '';
        taskInput.focus();
    }
}

// Render tasks based on current filter
function renderTasks() {
    // Clear task list
    taskList.innerHTML = '';
    
    // Filter tasks based on current filter
    let filteredTasks = [];
    
    switch (currentFilter) {
        case 'pending':
            filteredTasks = tasks.filter(task => !task.completed);
            break;
        case 'completed':
            filteredTasks = tasks.filter(task => task.completed);
            break;
        default:
            filteredTasks = tasks;
    }
    
    // Sort tasks by creation date (newest first)
    filteredTasks.sort((a, b) => b.createdAt - a.createdAt);
    
    // Generate task items
    if (filteredTasks.length === 0) {
        taskList.innerHTML = '<li class="no-tasks">No tasks found</li>';
    } else {
        filteredTasks.forEach(task => {
            const taskItem = document.createElement('li');
            taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
            taskItem.innerHTML = `
                <div class="task-check ${task.completed ? 'completed' : ''}" data-id="${task.id}">
                    <i class="fas fa-check"></i>
                </div>
                <span class="task-text">${task.text}</span>
                <button class="task-delete" data-id="${task.id}">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            taskList.appendChild(taskItem);
        });
    }
}

// Handle clicks on task items (toggle completion or delete)
function handleTaskClick(e) {
    const element = e.target;
    
    // Check if clicked on check button or its icon
    if (element.closest('.task-check')) {
        const taskId = Number(element.closest('.task-check').getAttribute('data-id'));
        toggleTaskCompletion(taskId);
    }
    
    // Check if clicked on delete button or its icon
    if (element.closest('.task-delete')) {
        const taskId = Number(element.closest('.task-delete').getAttribute('data-id'));
        deleteTask(taskId);
    }
}

// Toggle task completion status
function toggleTaskCompletion(id) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            return { ...task, completed: !task.completed };
        }
        return task;
    });
    
    // Save to localStorage
    saveTasks();
    
    // Render tasks
    renderTasks();
    
    // Update task count
    updateTasksCount();
}

// Delete task
function deleteTask(id) {
    // Remove task from array
    tasks = tasks.filter(task => task.id !== id);
    
    // Save to localStorage
    saveTasks();
    
    // Render tasks
    renderTasks();
    
    // Update task count
    updateTasksCount();
}

// Clear completed tasks
function clearCompleted() {
    // Remove all completed tasks
    tasks = tasks.filter(task => !task.completed);
    
    // Save to localStorage
    saveTasks();
    
    // Render tasks
    renderTasks();
    
    // Update task count
    updateTasksCount();
}

// Update pending tasks count
function updateTasksCount() {
    const pendingCount = tasks.filter(task => !task.completed).length;
    pendingTasksCount.textContent = `${pendingCount} task${pendingCount !== 1 ? 's' : ''} left`;
}

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Initialize the app
document.addEventListener('DOMContentLoaded', init);