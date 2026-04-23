//Seleção de elementos
const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todolist = document.querySelector("#todo-list");
const editForm = document.querySelector("#edit-form");
const editInput= document.querySelector("#edit-input");
const cancelEditBtn = document.querySelector("#cancel-edit-btn");
const searchInput = document.querySelector("#search-input");
const filterBtn = document.querySelector("#filter-select");

let oldInputValue; 

// Funções
const saveTodo = (text, done = 0, save = 1) => {
  const todo = document.createElement("div");
  todo.classList.add("todo");

  if (done) {
    todo.classList.add("done");
  }

  const todoTitle = document.createElement("h3");
  todoTitle.innerText = text;
  todo.appendChild(todoTitle);

  const doneBtn = document.createElement("button");
  doneBtn.classList.add("finish-todo");
  doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
  todo.appendChild(doneBtn);

  const editBtn = document.createElement("button");
  editBtn.classList.add("edit-todo");
  editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
  todo.appendChild(editBtn);

  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("remove-todo");
  deleteBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
  todo.appendChild(deleteBtn);

  // O Pulo do Gato para o LocalStorage funcionar
  if (save) {
    saveTodoLocalStorage({ text, done: 0 });
  }

  todolist.appendChild(todo);

  todoInput.value = "";
  todoInput.focus();
};

const toggleForms = () => {
    editForm.classList.toggle("hide")
    todoForm.classList.toggle("hide")
    todolist.classList.toggle("hide")
};

const updateTodo = (text) => {

  const todos = document.querySelectorAll(".todo")

  todos.forEach((todo) => {

    let todoTitle = todo.querySelector("h3");

    if (todoTitle.innerText === oldInputValue) {
        todoTitle.innerText = text;
    }
  });
 


};

//Eventos
todoForm.addEventListener("submit", (e) => {

    e.preventDefault()

    const inputValue = todoInput.value

    if(inputValue) {
        saveTodo(inputValue)  
    }
});

document.addEventListener("click", (e) =>{
const targetEl = e.target;
    const parentEl = targetEl.closest("div");
    let todoTitle;

if (parentEl && parentEl.querySelector("h3")) {
        todoTitle = parentEl.querySelector("h3").innerText;
}

if (targetEl.classList.contains("finish-todo")) {
        parentEl.classList.toggle("done");
}

if (targetEl.classList.contains("remove-todo")) {
        parentEl.remove();
}

if (targetEl.classList.contains("edit-todo")) {
        toggleForms();
        editInput.value = todoTitle;
        oldInputValue = todoTitle;
}
});

cancelEditBtn.addEventListener("click", (e) => {
e.preventDefault()

toggleForms();
});

editForm.addEventListener("submit", (e) =>{
    
    e.preventDefault()

    const editInputValue = editInput.value

    if(editInputValue) {
     updateTodo(editInputValue)
    }
    toggleForms()
})

// Função de Busca
const getSearchTodos = (search) => {
  const todos = document.querySelectorAll(".todo");

  todos.forEach((todo) => {
    let todoTitle = todo.querySelector("h3").innerText.toLowerCase();
    const normalizedSearch = search.toLowerCase();

    todo.style.display = "flex"; // Reseta para todos aparecerem antes de filtrar

    if (!todoTitle.includes(normalizedSearch)) {
      todo.style.display = "none"; // Esconde o que não combina
    }
  });
};

// Função de Filtro
const filterTodos = (filterValue) => {
  const todos = document.querySelectorAll(".todo");

  switch (filterValue) {
    case "all":
      todos.forEach((todo) => (todo.style.display = "flex"));
      break;

    case "done":
      todos.forEach((todo) =>
        todo.classList.contains("done")
          ? (todo.style.display = "flex")
          : (todo.style.display = "none")
      );
      break;

    case "todo":
      todos.forEach((todo) =>
        !todo.classList.contains("done")
          ? (todo.style.display = "flex")
          : (todo.style.display = "none")
      );
      break;

    default:
      break;
  }
};

// Evento de Busca
searchInput.addEventListener("keyup", (e) => {
  const search = e.target.value;
  getSearchTodos(search);
});

// Evento de Filtro
filterBtn.addEventListener("change", (e) => {
  const filterValue = e.target.value;
  filterTodos(filterValue);
});

// Função que lê as tarefas que já estão salvas no navegador
const getTodosLocalStorage = () => {
  const todos = JSON.parse(localStorage.getItem("todos")) || [];
  return todos;
};

// Função que carrega as tarefas salvas quando você abre o site
const loadTodos = () => {
  const todos = getTodosLocalStorage();

  todos.forEach((todo) => {
    // Aqui chamamos a saveTodo passando 0 no final para NÃO salvar de novo
    saveTodo(todo.text, todo.done, 0); 
  });
};

// Função que guarda uma tarefa nova no navegador
const saveTodoLocalStorage = (todo) => {
  const todos = getTodosLocalStorage();
  todos.push(todo);
  localStorage.setItem("todos", JSON.stringify(todos));
};

// Linha que faz carregar ao abrir o site
loadTodos();