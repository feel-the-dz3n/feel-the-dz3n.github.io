class Task {
    constructor(name, done, description, dueDateTime) {
        this.name = name;
        this.done = done;
        this.description = description;
        this.dueDateTime = dueDateTime;
    }
}

function isTaskOutdated(task) {
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

    html.push(`<div class='task-item'>`);

    html.push(`<div class='task-item__header'>`);
    html.push(`<div class='task-item__title-container'>`);
    html.push(`<input type="checkbox" class="task-item__doneCheckbox" `, task.done ? `checked` : ``, `>`);
    html.push(`<h3 class="task-item__name `, task.done ? `task-item__name_done` : ``, `">`, task.name, "</h3>");
    html.push(`</div>`); // title-container
    if (task.dueDateTime) {
        html.push(`<div class="task-item__dueDateTime `, isTaskOutdated(task) ? `task-item__dueDateTime_outdated` : ``, `">`, getTaskDueDateTime(task), "</div>");
    }
    html.push(`</div>`);

    if (task.description) {
        html.push(`<p class="task-item__description">`, task.description, `</p>`);
    }

    html.push(`</div>`);

    return html.join("");
}

let tasks = [
    new Task("Task One", false, "This is the description for task one.", new Date("12.01.2021 14:00")),
    new Task("Task Two", true, null, new Date("12.05.2021 14:00")),
    new Task("Task Without Date", true, null, null),
    new Task("Task Outdated", true, "This task is outdated...", new Date("12.05.2015 14:00")),
    new Task("Task One", false, "This is the description for task one.", new Date("12.01.2021 14:00")),
    new Task("Task Two", true, null, new Date("12.05.2021 14:00")),
    new Task("Task Without Date", true, null, null),
    new Task("Task Outdated", true, "This task is outdated...", new Date("12.05.2015 14:00")),
    new Task("Task One", false, "This is the description for task one.", new Date("12.01.2021 14:00")),
    new Task("Task Two", true, null, new Date("12.05.2021 14:00")),
    new Task("Task Without Date", true, null, null),
    new Task("Task Outdated", true, "This task is outdated...", new Date("12.05.2015 14:00")),
];

let taskListDom = document.getElementById("task-list");

for (let task of tasks) {
    taskListDom.innerHTML += taskToDom(task);
}
