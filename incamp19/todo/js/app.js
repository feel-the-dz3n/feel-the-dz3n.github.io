class Task {
    constructor(id, name, done, description, dueDateTime) {
        this.id = id;
        this.name = name;
        this.done = done;
        this.description = description;
        this.dueDateTime = dueDateTime;
    }
}

let lastId = 0;

function getId() {
    lastId++;
    return lastId;
}

let tasks = [
    new Task(getId(), "Feed The Cat", false, null, new Date("12.01.2021 14:00")),
    new Task(getId(), "Buy Goods", false, "Bread, cat feed, mop", new Date("01.01.2021 14:00")),
    new Task(getId(), "Wash The Car", true, null, new Date("12.05.2021 14:00")),
    new Task(getId(), "Visit Doctor", false, null, new Date("12.02.2021 14:00")),
];

function createTaskClick(event) {
    let title = document.getElementById("new-task-title");
    let description = document.getElementById("new-task-description");
    let date = document.getElementById("new-task-date");

    if (title.value !== "") {
        console.log(date.value, new Date(date.value), getFormattedDate(new Date(date.value)));
        let task = new Task(getId(), title.value, false, description.value, new Date(date.value));

        tasks.push(task);
        appendDomTask(task);

        title.value = "";
        description.value = "";
        date.value = "";

        setModalVisible(false);
    }
    else {
        alert('Enter the title.');
    }
}

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
    return now > task.dueDateTime;
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
    let date = task.dueDateTime;
    return getFormattedDate(date);
}

function taskToDom(task) {
    var html = [];

    html.push(`<div class='task-item `, task.done ? `task-item_done` : ``, `' data-id='`, task.id, `'>`);
    html.push(`<a class='task-item__remove-icon' data-id='`, task.id, `' href="#" onclick='removeTaskEvent(event)'>&#10060;</a>`);

    html.push(`<div class='task-item__header'>`);
    html.push(`<div class='task-item__title-side-container'>`);
    html.push(`<input type="checkbox" class="task-item__doneCheckbox" onclick="changeTaskStatusEvent(event)" `, task.done ? `checked` : ``, `>`);
    html.push(`<h3 class="task-item__name `, task.done ? `task-item__name_done` : ``, `">`, task.name, "</h3>");
    html.push(`</div>`); // task-item__title-side-container
    html.push(`<div class='task-item__title-side-container'>`);
    if (task.dueDateTime) {
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

    for (let task of tasks) {
        // if show all or show only incomplete
        if (radioAll.checked || (radioIncomplete.checked && !task.done))
            appendDomTask(task);
    }
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
