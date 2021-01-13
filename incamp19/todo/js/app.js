const tasksEndpoint = "http://127.0.0.1:8080/tasks"

class Task {
    constructor(idOrObject, title, description, done, dueTime) {
        if (typeof idOrObject === 'object') {
            Object.assign(this, idOrObject);
            this.dueTime = new Date(idOrObject.dueTime);
        } else {
            this.id = idOrObject;
            this.title = title;
            this.done = done;
            this.description = description;
            this.dueTime = dueTime;
        }

        if (this.title === "") {
            throw new Error("Task's name can't be empty");
        }
    }
}

const createTaskForm = document.forms['add-task'];
createTaskForm.addEventListener('submit', (event) => {
    event.preventDefault();
    try {
        const formData = new FormData(createTaskForm);
        const taskObject = Object.fromEntries(formData.entries());
        const task = new Task(getId(), taskObject.name, false, taskObject.description, new Date(taskObject.dueDateTime));
        tasks.push(task);
        appendDomTask(task);
        setModalVisible(false);
        createTaskForm.reset();
    } catch (e) {
        alert(e);
    }
})

function setModalVisible(visible) {
    let modalContent = document.querySelector(".modal-content");

    if (visible) {
        modalContent.classList.add("modal-content_show");
        modalContent.classList.remove("modal-content_hide");
    }
    else {
        modalContent.classList.remove("modal-content_show");
        modalContent.classList.add("modal-content_hide");
    }
}

function hideModalEvent(event) {
    setModalVisible(false);
}

function addTaskClickEvent(event) {
    setModalVisible(true);
}

function isTaskOverdue(task) {
    let now = new Date();
    return now > task.dueTime;
}

function formatDateDigit(num) {
    if ((num + '').length <= 1) {
        return '0' + num;
    }
    else {
        return num;
    }
}

function getFormattedDate(date) {
    let day = formatDateDigit(date.getDate());
    let month = formatDateDigit(date.getMonth() + 1);
    let year = date.getFullYear();
    let hour = formatDateDigit(date.getHours());
    let minute = formatDateDigit(date.getMinutes());
    return `${day}.${month}.${year} ${hour}:${minute}`;
}

function getTaskDueDateTime(task) {
    let date = task.dueTime;
    return getFormattedDate(date);
}

function taskToDom(task) {
    var html = [];

    html.push(`<div class='task-item `, task.done ? `task-item_done` : ``, `' data-id='`, task.id, `'>`);
    html.push(`<a class='task-item__remove-icon' data-id='`, task.id, `' href="#" onclick='removeTaskEvent(event)'>&#10060;</a>`);

    html.push(`<div class='task-item__header'>`);
    html.push(`<div class='task-item__title-side-container'>`);
    html.push(`<input type="checkbox" class="task-item__doneCheckbox" onclick="changeTaskStatusEvent(event)" `, task.done ? `checked` : ``, `>`);
    html.push(`<h3 class="task-item__name `, task.done ? `task-item__name_done` : ``, `">`, task.title, "</h3>");
    html.push(`</div>`); // task-item__title-side-container
    html.push(`<div class='task-item__title-side-container'>`);
    if (task.dueTime && !isNaN(task.dueTime)) {
        html.push(`<div class="task-item__dueDateTime `, !task.done && isTaskOverdue(task) ? `task-item__dueDateTime_overdue` : ``, `">`, getTaskDueDateTime(task), "</div>");
    }
    html.push(`</div>`); // task-item__title-side-container
    html.push(`</div>`); // task-item__header

    if (task.description) {
        html.push(`<p class="task-item__description">`, task.description, `</p>`);
    }

    html.push(`</div>`); // task-item

    return html.join("");
}


function changeTaskStatusEvent(event) {
    let taskItemNode = event.target.parentNode.parentNode.parentNode;
    let taskId = taskItemNode.dataset.id;

    let task = tasks.find(task => task.id == taskId);
    task.done = !task.done;

    taskItemNode.outerHTML = taskToDom(task);

    return false;
}

function removeTaskEvent(event) {
    let id = event.target.dataset.id;
    let taskItemBlock = event.target.parentNode;

    let taskIndex = tasks.findIndex(task => task.id == id);
    // remove task from array
    tasks.splice(taskIndex, 1);

    // put a class modificator that element is removed
    // this is supposed to be a fadeout animation
    taskItemBlock.classList.add("task-item__removed");

    // after fadeout timeout remove block from the page
    setTimeout(function () { taskItemBlock.remove(); }, 500);

    return false;
}

function appendDomTask(task) {
    let taskListDom = document.getElementById("task-list");
    taskListDom.innerHTML += taskToDom(task);
}

function refreshTasks() {
    let radioIncomplete = document.getElementById("filter-incomplete");
    let radioAll = document.getElementById("filter-all");

    document.getElementById("task-list").innerHTML = "";

    fetch(tasksEndpoint)
        .then(response => response.json())
        .then(tasks => tasks.forEach(function (taskJson) {
            if (radioAll.checked || (radioIncomplete.checked && !task.done)) {
                appendDomTask(new Task(taskJson));
            }
        }));
}

function setFilterCheck(id) {
    let radioIncomplete = document.getElementById("filter-incomplete");
    let radioAll = document.getElementById("filter-all");

    radioIncomplete.checked = false;
    radioAll.checked = false;

    document.getElementById(id).checked = true;
}

function filterAll(event) {
    setFilterCheck("filter-all");
    refreshTasks();
}

function filterIncomplete(event) {
    setFilterCheck("filter-incomplete");
    refreshTasks();
}

setFilterCheck("filter-all");
filterAll(null); // force update
