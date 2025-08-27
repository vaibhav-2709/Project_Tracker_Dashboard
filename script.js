document.addEventListener('DOMContentLoaded', () => {
  loadTasks();

  const form = document.querySelector('#taskForm form');
  if (form) {
    form.addEventListener('submit', addTask);
  }

  window.showForm = function () {
    const formBox = document.getElementById('taskForm');
    formBox.style.display = (formBox.style.display === 'none' || formBox.style.display === '') ? 'block' : 'none';
  };
});

function addTask(event) {
  event.preventDefault();

  const title = document.getElementById('title').value;
  const description = document.getElementById('description').value;
  const assigned_to = document.getElementById('assigned_to').value;
  const deadline = document.getElementById('deadline').value;
  const taskIdInput = document.getElementById('edit-id');

  const isEditing = taskIdInput && taskIdInput.value !== '';
  const body = `title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}&assigned_to=${encodeURIComponent(assigned_to)}&deadline=${encodeURIComponent(deadline)}${isEditing ? `&id=${taskIdInput.value}` : ''}`;

  fetch(isEditing ? 'update_task.php' : 'add_task.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body
  })
    .then(res => res.text())
    .then(() => {
      document.getElementById('taskForm').style.display = 'none';
      event.target.reset();
      if (taskIdInput) taskIdInput.remove();
      loadTasks();
    });
}

function loadTasks() {
  fetch('get_tasks.php')
    .then(res => res.json())
    .then(data => {
      const statuses = ['To Do', 'In Progress', 'Done'];
      statuses.forEach(status => {
        const container = document.getElementById(`${status}-tasks`);
        container.innerHTML = '';

        data.filter(task => task.status === status).forEach(task => {
          const div = document.createElement('div');
          div.className = 'task';
          div.draggable = true;
          div.ondragstart = e => e.dataTransfer.setData('text/plain', task.id);
          div.innerHTML = `
            <strong>${task.title}</strong><br>
            ${task.description}<br>
            <small>${task.assigned_to} | ${task.deadline}</small><br>
            <button class="edit-btn" onclick="editTask(${task.id}, '${escapeQuotes(task.title)}', '${escapeQuotes(task.description)}', '${escapeQuotes(task.assigned_to)}', '${task.deadline}')">Edit</button>
            <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
          `;
          container.appendChild(div);
        });
      });
    });
}

function escapeQuotes(str) {
  return str.replace(/'/g, "\\'").replace(/"/g, '\\"');
}

window.allowDrop = function (ev) {
  ev.preventDefault();
};

window.drop = function (ev, status) {
  ev.preventDefault();
  const taskId = ev.dataTransfer.getData('text/plain');

  fetch('update_task_status.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `id=${taskId}&status=${encodeURIComponent(status)}`
  })
    .then(() => loadTasks());
};

window.deleteTask = function (id) {
  if (confirm('Are you sure you want to delete this task?')) {
    fetch('delete_task.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `id=${id}`
    }).then(() => loadTasks());
  }
};

window.editTask = function (id, title, description, assigned_to, deadline) {
  const formBox = document.getElementById('taskForm');
  formBox.style.display = 'block';

  document.getElementById('title').value = title;
  document.getElementById('description').value = description;
  document.getElementById('assigned_to').value = assigned_to;
  document.getElementById('deadline').value = deadline;

  let existingHidden = document.getElementById('edit-id');
  if (!existingHidden) {
    const hidden = document.createElement('input');
    hidden.type = 'hidden';
    hidden.id = 'edit-id';
    hidden.name = 'id';
    document.querySelector('#taskForm form').appendChild(hidden);
  }
  document.getElementById('edit-id').value = id;
};
