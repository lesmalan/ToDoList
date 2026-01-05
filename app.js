'use strict';

const STORAGE_KEY = 'todoList.items';

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

let todos = [
  { id: generateId(), text: 'Incomplete item 1', done: false },
  { id: generateId(), text: 'Incomplete item 2', done: false },
  { id: generateId(), text: 'Incomplete item 3', done: false },
  { id: generateId(), text: 'Completed item 1', done: true },
  { id: generateId(), text: 'Completed item 2', done: true }
];

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function load() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) todos = JSON.parse(raw);
}

function createIconButton(classes, ariaLabel, svgMarkup) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = `icon-btn ${classes}`;
  btn.setAttribute('aria-label', ariaLabel);
  btn.title = ariaLabel;
  btn.innerHTML = svgMarkup;
  return btn;
}

const CHECK_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M20.285 6.708l-11.39 11.39-5.182-5.182 1.414-1.414 3.768 3.768 9.976-9.977z"/></svg>';
const X_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M18.3 5.71L12 12.01 5.71 5.71 4.29 7.12 10.59 13.41 4.29 19.71 5.71 21.12 12 14.82 18.29 21.12 19.71 19.71 13.41 13.41 19.71 7.12z"/></svg>';

function render() {
  const incompleteEl = document.getElementById('incomplete-list');
  const completedEl = document.getElementById('completed-list');
  incompleteEl.innerHTML = '';
  completedEl.innerHTML = '';

  todos.forEach(item => {
    const li = document.createElement('li');
    const textSpan = document.createElement('span');
    textSpan.textContent = item.text;
    if (item.done) textSpan.style.textDecoration = 'line-through';
    li.appendChild(textSpan);

    const toggleBtn = createIconButton(
      item.done ? 'mark-incomplete' : 'mark-complete',
      item.done ? 'Mark incomplete' : 'Mark complete',
      CHECK_SVG
    );
    toggleBtn.addEventListener('click', () => {
      item.done = !item.done;
      save();
      render();
    });

    const deleteBtn = createIconButton('delete', 'Delete task', X_SVG);
    deleteBtn.addEventListener('click', () => {
      todos = todos.filter(t => t.id !== item.id);
      save();
      render();
    });

    li.appendChild(toggleBtn);
    li.appendChild(deleteBtn);

    if (item.done) completedEl.appendChild(li);
    else incompleteEl.appendChild(li);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  load();
  render();

  const form = document.getElementById('new-task-form');
  const input = document.getElementById('new-task-input');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    todos.push({ id: generateId(), text, done: false });
    input.value = '';
    save();
    render();
  });
});