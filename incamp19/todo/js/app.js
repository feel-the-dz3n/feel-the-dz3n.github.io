class Task {
    constructor(id, name, done, description, dueDateTime) {
        this.id = id;
        this.name = name;
        this.done = done;
        this.description = description;
        this.dueDateTime = dueDateTime;
    }
}

let tasks = [
    new Task(1, "Task One", false, "This is the description for task one.", new Date("12.01.2021 14:00")),
    new Task(2, "Task Two", true, null, new Date("12.05.2021 14:00")),
    new Task(3, "Task Without Date", true, null, null),
    new Task(4, "Task Overdue", false, "This task is overdue...", new Date("12.05.2015 14:00")),
    new Task(5, "Task One", false, "This is the description for task one.", new Date("12.01.2021 14:00")),
    new Task(6, "Task Two", true, null, new Date("12.05.2021 14:00")),
    new Task(7, "Task Without Date", true, null, null),
    new Task(8, "Task Overdue", true, "This task is overdue...", new Date("12.05.2015 14:00")),
    new Task(9, "Task One", false, "This is the description for task one.", new Date("12.01.2021 14:00")),
    new Task(10, "Task Two", true, null, new Date("12.05.2021 14:00")),
    new Task(11, "Task Without Date", true, null, null),
    new Task(12, "Task Overdue", true, "This task is overdue...", new Date("12.05.2015 14:00")),
];

function isTaskOverdue(task) {
    let now = new Date();
    return now > task.dueDateTime;
}

function getTaskDueDateTime(task) {
    let date = task.dueDateTime;
    // FIXME: leading zeros
    return `${date.getDay()}.${date.getMonth()}.${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
}

function taskToDom(task) {
    var html = [];

    html.push(`<div class='task-item `, task.done ? `task-item_done` : ``, `' data-id='`, task.id, `'>`);
    html.push(`<a class='task-item__remove-icon' href="#">&#128465;</a>`);

    html.push(`<div class='task-item__header'>`);
    html.push(`<div class='task-item__title-side-container'>`);
    html.push(`<input type="checkbox" class="task-item__doneCheckbox" `, task.done ? `checked` : ``, `>`);
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

function refreshTasks() {
    let taskListDom = document.getElementById("task-list");
    let radioIncomplete = document.getElementById("filter-incomplete");
    let radioAll = document.getElementById("filter-all");

    taskListDom.innerHTML = "";

    for (let task of tasks) {
        // if show all or show only incomplete
        if (radioAll.checked || (radioIncomplete.checked && !task.done))
            taskListDom.innerHTML += taskToDom(task);
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
