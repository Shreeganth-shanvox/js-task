// ---------- State ----------
let tasks = [
  { id: 1, text: "Learn React", completed: false },
  { id: 2, text: "Prototyping To-Do List", completed: true },
  { id: 3, text: "Push to Github", completed: false },
];
let currentFilter = "All"; // "All" | "Active" | "Completed"
let nextId = tasks.length + 1;

// ---------- DOM references ----------
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const tasksLeftCount = document.getElementById("tasksLeftCount");
const filterButtons = document.querySelectorAll(".filter-btn");
const menuBtn = document.getElementById("menuBtn");
const sidebar = document.querySelector(".sidebar");

// ---------- Render ----------
function getFilteredTasks() {
  if (currentFilter === "Active") return tasks.filter((t) => !t.completed);
  if (currentFilter === "Completed") return tasks.filter((t) => t.completed);
  return tasks;
}

function render() {
  taskList.innerHTML = "";

  getFilteredTasks().forEach((task) => {
    const li = document.createElement("li");
    li.className = "task-item" + (task.completed ? " completed" : "");
    li.dataset.id = task.id;

    li.innerHTML = `
      <input type="checkbox" ${task.completed ? "checked" : ""} aria-label="Mark task complete" />
      <label>${escapeHtml(task.text)}</label>
      <button class="icon-btn edit-btn" aria-label="Edit task">${editIcon()}</button>
      <button class="icon-btn delete-btn" aria-label="Delete task">${trashIcon()}</button>
    `;

    taskList.appendChild(li);
  });

  const activeCount = tasks.filter((t) => !t.completed).length;
  tasksLeftCount.textContent = activeCount;
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function editIcon() {
  return `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/></svg>`;
}

function trashIcon() {
  return `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M5.5 5.5a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/><path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/></svg>`;
}

// ---------- Actions ----------
function addTask(text) {
  const trimmed = text.trim();
  if (!trimmed) return;
  tasks.push({ id: nextId++, text: trimmed, completed: false });
  render();
}

function deleteTask(id) {
  tasks = tasks.filter((t) => t.id !== id);
  render();
}

function toggleTask(id) {
  const task = tasks.find((t) => t.id === id);
  if (task) task.completed = !task.completed;
  render();
}

function editTask(id, li) {
  const task = tasks.find((t) => t.id === id);
  if (!task) return;

  const label = li.querySelector("label");
  const input = document.createElement("input");
  input.type = "text";
  input.value = task.text;
  input.className = "edit-input";
  label.replaceWith(input);
  input.focus();
  input.select();

  function commit() {
    const newText = input.value.trim();
    if (newText) task.text = newText;
    render();
  }

  input.addEventListener("blur", commit);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") input.blur();
    if (e.key === "Escape") render();
  });
}

// ---------- Event listeners ----------
taskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  addTask(taskInput.value);
  taskInput.value = "";
  taskInput.focus();
});

taskList.addEventListener("click", (e) => {
  const li = e.target.closest(".task-item");
  if (!li) return;
  const id = Number(li.dataset.id);

  if (e.target.matches('input[type="checkbox"]')) {
    toggleTask(id);
  } else if (e.target.closest(".delete-btn")) {
    deleteTask(id);
  } else if (e.target.closest(".edit-btn")) {
    editTask(id, li);
  }
});

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    currentFilter = btn.dataset.filter;
    filterButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    render();
  });
});

menuBtn.addEventListener("click", () => {
  sidebar.classList.toggle("collapsed");
});

// ---------- Init ----------
render();

