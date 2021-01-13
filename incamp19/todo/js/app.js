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
    }
}

function postTask(task) {
    return fetch(tasksEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(task)
    }).then(handleErrorsGetJson);
}

const createTaskForm = document.forms['add-task'];
createTaskForm.addEventListener('submit', (event) => {
    event.preventDefault();
    try {
        const formData = new FormData(createTaskForm);
        const taskObject = Object.fromEntries(formData.entries());

        if (taskObject.title === "")
            throw new Error("Task's title can't be empty");

        postTask(taskObject)
            .then(taskJson => {
                const task = new Task(taskJson);
                appendDomTask(task);
                setModalVisible(false);
                createTaskForm.reset();
            })
            .catch(err => {
                console.log(err);
                alert("Something went wrong");
            });
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

function handleErrors(response) {
    if (!response.ok) throw new Error("Request failed");
    return response;
}

function handleErrorsGetJson(response) {
    return handleErrors(response).json();
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

function isDateTimeCorrect(dateTime) {
    return dateTime && !isNaN(dateTime) && dateTime > new Date(0);
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
    if (isDateTimeCorrect(task.dueTime)) {
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

function putTaskRequest(task) {
    return fetch(tasksEndpoint + `/${task.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(task)
    }).then(handleErrorsGetJson);
}

function fetchTasksById(taskId) {
    return fetch(tasksEndpoint + `/${taskId}`)
        .then(handleErrorsGetJson);
}

function changeTaskStatusEvent(event) {
    let taskItemNode = event.target.parentNode.parentNode.parentNode;
    let taskId = taskItemNode.dataset.id;
    let newStatus = event.target.checked;

    event.target.classList.add("task-item__doneCheckbox_fetching");

    fetchTasksById(taskId)
        .then(task => {
            task.done = newStatus;

            putTaskRequest(task)
                .then(newTask => {
                    taskItemNode.outerHTML = taskToDom(newTask);
                });
        })
        .catch(err => {
            console.log(err);
            alert("Something went wrong");
            event.target.checked = !newStatus;

            event.target.classList.remove("task-item__doneCheckbox_fetching");
        });

    return false;
}

function sendRemoveTaskRequest(taskId) {
    return fetch(tasksEndpoint + `/${taskId}`, { method: 'DELETE' })
        .then(handleErrors);
}

function removeTaskEvent(event) {
    let id = event.target.dataset.id;
    let taskItemBlock = event.target.parentNode;

    // put a class modificator that element is removed
    // this is supposed to be a fadeout animation
    taskItemBlock.classList.add("task-item__removed");

    sendRemoveTaskRequest(taskItemBlock.dataset.id)
        .then(_ => setTimeout(function () { taskItemBlock.remove(); }, 500))
        .catch(err => {
            console.log(err);
            alert("Unable to remove task");
            taskItemBlock.classList.remove("task-item__removed");
        });

    return false;
}

function appendDomTask(task) {
    let taskListDom = document.getElementById("task-list");
    taskListDom.innerHTML += taskToDom(task);
}

function fetchTasks() {
    return fetch(tasksEndpoint)
        .then(handleErrorsGetJson);
}

function refreshTasks() {
    const radioIncomplete = document.getElementById("filter-incomplete");
    const radioAll = document.getElementById("filter-all");

    const taskListBlock = document.getElementById("task-list");
    taskListBlock.innerHTML = "";

    fetchTasks()
        .then(tasksJson => {
            tasksJson.forEach(function (taskJson) {
                const task = new Task(taskJson);
                if (radioAll.checked || (radioIncomplete.checked && !task.done)) {
                    appendDomTask(task);
                }
            })
        })
        .catch(err => {
            console.log(err);
            taskListBlock.innerHTML = "Something went wrong";
        });
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
