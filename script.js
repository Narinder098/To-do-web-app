document.addEventListener("DOMContentLoaded", () => {
    const addTaskBtn = document.getElementById("add-task-btn");
    const taskList = document.getElementById("task-list");
    const searchTask = document.getElementById("search-task");

    const allTasksBtn = document.getElementById("all-tasks");
    const activeTasksBtn = document.getElementById("active-tasks");
    const completedTasksBtn = document.getElementById("completed-tasks");

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let filter = 'all'; // Default filter for tasks

    addTaskBtn.addEventListener("click", addTask);
    searchTask.addEventListener("input", searchTasks);

    allTasksBtn.addEventListener("click", () => setFilter("all"));
    activeTasksBtn.addEventListener("click", () => setFilter("active"));
    completedTasksBtn.addEventListener("click", () => setFilter("completed"));

    function setFilter(newFilter) {
        filter = newFilter;
        displayTasks();
    }

    function addTask() {
        const title = document.getElementById("task-title").value;
        const date = document.getElementById("task-date").value;
        const time = document.getElementById("task-time").value;
        const priority = document.getElementById("task-priority").value;
        const category = document.getElementById("task-category").value;

        if (title && date && time) {
            const task = {
                id: Date.now(),
                title,
                date,
                time,
                priority,
                category,
                completed: false,
            };
            tasks.push(task);
            saveTasks();
            displayTasks();
            clearInputFields();
        } else {
            alert("Please fill in all fields");
        }
    }

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function displayTasks() {
        taskList.innerHTML = "";
        const filteredTasks = tasks.filter(task => {
            if (filter === "all") return true;
            if (filter === "active") return !task.completed;
            if (filter === "completed") return task.completed;
        });

        filteredTasks.forEach(task => {
            const taskItem = document.createElement("div");
            taskItem.className = `task-item${task.completed ? " completed" : ""}`;
            taskItem.innerHTML = `
                <div>
                    <h3>${task.title}</h3>
                    <p>${task.date} ${task.time}</p>
                    <p class="task-priority">Priority: ${task.priority}</p>
                </div>
                <div>
                    <button onclick="toggleComplete(${task.id})"><i class="fas fa-check"></i></button>
                    <button onclick="editTask(${task.id})"><i class="fas fa-edit"></i></button>
                    <button onclick="deleteTask(${task.id})"><i class="fas fa-trash"></i></button>
                </div>
            `;
            taskList.appendChild(taskItem);
        });
    }

    function clearInputFields() {
        document.getElementById("task-title").value = "";
        document.getElementById("task-date").value = "";
        document.getElementById("task-time").value = "";
        document.getElementById("task-priority").value = "Low";
        document.getElementById("task-category").value = "";
    }

    window.toggleComplete = function (id) {
        const task = tasks.find(task => task.id === id);
        task.completed = !task.completed;
        saveTasks();
        displayTasks();
    };

    window.editTask = function (id) {
        const task = tasks.find(task => task.id === id);
        document.getElementById("task-title").value = task.title;
        document.getElementById("task-date").value = task.date;
        document.getElementById("task-time").value = task.time;
        document.getElementById("task-priority").value = task.priority;
        document.getElementById("task-category").value = task.category;
        deleteTask(id);
    };

    window.deleteTask = function (id) {
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();
        displayTasks();
    };

    function searchTasks() {
        const searchValue = searchTask.value.toLowerCase();
        taskList.innerHTML = "";

        const filteredTasks = tasks.filter(task =>
            task.title.toLowerCase().includes(searchValue)
        );

        filteredTasks.forEach(task => {
            const taskItem = document.createElement("div");
            taskItem.className = `task-item${task.completed ? " completed" : ""}`;
            taskItem.innerHTML = `
                <div>
                    <h3>${task.title}</h3>
                    <p>${task.date} ${task.time}</p>
                    <p class="task-priority">Priority: ${task.priority}</p>
                </div>
                <div>
                    <button onclick="toggleComplete(${task.id})"><i class="fas fa-check"></i></button>
                    <button onclick="editTask(${task.id})"><i class="fas fa-edit"></i></button>
                    <button onclick="deleteTask(${task.id})"><i class="fas fa-trash"></i></button>
                </div>
            `;
            taskList.appendChild(taskItem);
        });
    }

    displayTasks(); // Initial load of tasks
});
