// Exercice 4 – Logique de la liste de tâches

let todos = JSON.parse(localStorage.getItem('todos') || '[]');
let currentFilter = 'all';

function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

function renderTodos() {
  const list = document.getElementById('todo-list');
  list.innerHTML = '';

  const filtered = todos.filter(function (todo) {
    if (currentFilter === 'active') return !todo.completed;
    if (currentFilter === 'completed') return todo.completed;
    return true;
  });

  if (filtered.length === 0) {
    list.innerHTML = '<li style="text-align:center;color:#a0aec0;padding:20px;">Aucune tâche</li>';
  }

  filtered.forEach(function (todo) {
    const li = document.createElement('li');
    if (todo.completed) li.classList.add('completed');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.completed;
    checkbox.addEventListener('change', function () {
      toggleTodo(todo.id);
    });

    const span = document.createElement('span');
    span.classList.add('todo-text');
    span.textContent = todo.text;

    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('delete-btn');
    deleteBtn.textContent = '✕';
    deleteBtn.title = 'Supprimer';
    deleteBtn.addEventListener('click', function () {
      deleteTodo(todo.id);
    });

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(deleteBtn);
    list.appendChild(li);
  });

  const remaining = todos.filter(function (t) { return !t.completed; }).length;
  document.getElementById('remaining-count').textContent =
    remaining + ' tâche(s) restante(s)';
}

function addTodo(text) {
  todos.push({
    id: Date.now(),
    text: text.trim(),
    completed: false,
  });
  saveTodos();
  renderTodos();
}

function toggleTodo(id) {
  const todo = todos.find(function (t) { return t.id === id; });
  if (todo) {
    todo.completed = !todo.completed;
    saveTodos();
    renderTodos();
  }
}

function deleteTodo(id) {
  todos = todos.filter(function (t) { return t.id !== id; });
  saveTodos();
  renderTodos();
}

function clearCompleted() {
  todos = todos.filter(function (t) { return !t.completed; });
  saveTodos();
  renderTodos();
}

// Soumission du formulaire
document.getElementById('todo-form').addEventListener('submit', function (e) {
  e.preventDefault();
  const input = document.getElementById('todo-input');
  const text = input.value.trim();
  if (text) {
    addTodo(text);
    input.value = '';
  }
});

// Boutons de filtre
document.querySelectorAll('.filter-btn').forEach(function (btn) {
  btn.addEventListener('click', function () {
    document.querySelector('.filter-btn.active').classList.remove('active');
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    renderTodos();
  });
});

// Supprimer les tâches terminées
document.getElementById('clear-completed').addEventListener('click', clearCompleted);

// Initialisation
renderTodos();
