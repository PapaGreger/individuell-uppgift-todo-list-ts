const createTodo = document.querySelector(".create-todo") as HTMLDivElement;
const createTodoInput = document.querySelector(".create-todo__input") as HTMLInputElement;
const defaultCreateTodoInputPlaceholder: string = createTodoInput.placeholder;
const createTodoButton = document.querySelector(".create-todo__button") as HTMLButtonElement;
const clearTodoListButton = document.querySelector(".clear-todo-list-button") as HTMLButtonElement;
const todoList = document.querySelector(".todo-list") as HTMLDivElement;

type Todo = {
    id: number,
    description: string,
    done: boolean,
}

const getSavedTodos = (): Todo[] => {
    const todosString = localStorage.getItem("todos");
    return  todosString ? JSON.parse(todosString) : [];
}

const toggleTodoDone = (event: Event) => {
    const checkbox = (event.target as HTMLInputElement);
    const todoItem = checkbox.closest(".todo-list__item") as HTMLDivElement;
    const todoId: number = parseInt(todoItem!.id);
    
    const todos: Todo[] = getSavedTodos();
    todos.find(todo => todo.id == todoId)!.done = checkbox.checked;

    localStorage.setItem("todos", JSON.stringify(todos));
}

const removeTodo = (event: Event) => {
    const todoItem = (event.target as HTMLElement).closest(".todo-list__item") as HTMLDivElement;
    const todoId: number = parseInt(todoItem!.id);
    
    todoList.removeChild(todoItem);
    const todos: Todo[] = getSavedTodos().filter(todo => todo.id != todoId);
    localStorage.setItem("todos", JSON.stringify(todos));
    checkTodoMoveButtons();
}

const editTodo = () => {

}

const checkTodoMoveButtons = () => {
    //Reset all
    todoList.childNodes.forEach(todo => {
      const todoListItemMoveUpButton = (todo as HTMLLIElement)?.querySelector(
        ".todo-list__item__move-up-down-wrapper__up-button"
      ) as HTMLButtonElement;
      todoListItemMoveUpButton.classList.remove("todo-list__item__move-up-down-wrapper__up-button--disabled");
      todoListItemMoveUpButton.disabled = false;
  
      const todoListItemMoveDownButton = (todo as HTMLElement)?.querySelector(
        ".todo-list__item__move-up-down-wrapper__down-button"
      ) as HTMLButtonElement;
      todoListItemMoveDownButton.classList.remove("todo-list__item__move-up-down-wrapper__down-button--disabled");
      todoListItemMoveDownButton.disabled = false;
    });
  
    //Hide correct
    if (todoList.childElementCount > 0) {
      const firstTodoListItemMoveUpButton = (todoList.firstChild as HTMLElement)?.querySelector(
        ".todo-list__item__move-up-down-wrapper__up-button"
      ) as HTMLButtonElement;
      firstTodoListItemMoveUpButton.classList.add("todo-list__item__move-up-down-wrapper__up-button--disabled");
      firstTodoListItemMoveUpButton.disabled = true;
  
      const lastTodoListItemMoveDownButton = (todoList.lastChild as HTMLElement)?.querySelector(
        ".todo-list__item__move-up-down-wrapper__down-button"
      ) as HTMLButtonElement;
      lastTodoListItemMoveDownButton.classList.add("todo-list__item__move-up-down-wrapper__down-button--disabled");
      lastTodoListItemMoveDownButton.disabled = true;
    }
  };

type MoveDirection = "up" | "down";
const moveTodo = (event: Event, moveDirection: MoveDirection) => {
    const todoItem = (event.target as HTMLButtonElement)!.closest(".todo-list__item") as HTMLDivElement;
    const sibling = (moveDirection === "up" ? todoItem.previousSibling : todoItem.nextSibling) as HTMLDivElement

    if (sibling) {
        todoList.insertBefore(todoItem, moveDirection === "up" ? sibling : sibling.nextSibling);

        //Update saved order
        const todos = getSavedTodos();
    
        const todoObjectIndex = todos.findIndex(
          (todo) => todo.id == parseInt(todoItem!.id)
        );
        const nextSiblingIndex = todos.findIndex(
          (todo) => todo.id == parseInt((sibling as HTMLDivElement).id)
        );
    
        const tempTodoObject = todos[todoObjectIndex];
        todos[todoObjectIndex] = todos[nextSiblingIndex];
        todos[nextSiblingIndex] = tempTodoObject;
    
        localStorage.setItem("todos", JSON.stringify(todos));
      }

    checkTodoMoveButtons();
}


const displaySingleTodo = (todo: Todo) => {
    const todoListItem = document.createElement("article");
    todoListItem.classList.add("todo-list__item");
    todoListItem.id = todo.id.toString();

    const todoListItemCheckbox = document.createElement("input");
    todoListItemCheckbox.classList.add("todo-list__item__checkbox")
    todoListItemCheckbox.type = "checkbox";
    todoListItemCheckbox.checked = todo.done;
    todoListItemCheckbox.addEventListener("change", toggleTodoDone);
    todoListItem.appendChild(todoListItemCheckbox);

    const todoListItemDescription = document.createElement("p");
    todoListItemDescription.classList.add("todo-list__item__description");
    todoListItemDescription.textContent = `${todo.description}`;
    todoListItem.appendChild(todoListItemDescription);

    const todoListItemMoveUpDownWrapper = document.createElement("div");
    todoListItemMoveUpDownWrapper.classList.add("todo-list__item__move-up-down-wrapper")

    const todoListItemMoveUpButton = document.createElement("button");
    todoListItemMoveUpButton.classList.add("todo-list__item__move-up-down-wrapper__up-button");
    todoListItemMoveUpButton.type = "button";
    todoListItemMoveUpButton.addEventListener("click", (event: Event) => moveTodo(event, "up"));

    const todoListMoveUpButtonIcon = document.createElement("i");
    todoListMoveUpButtonIcon.classList.add("todo-list__item__move-up-down-wrapper__up-button__icon", "material-symbols-outlined");
    todoListMoveUpButtonIcon.textContent = "keyboard_arrow_up";
    todoListItemMoveUpButton.appendChild(todoListMoveUpButtonIcon);

    todoListItemMoveUpDownWrapper.appendChild(todoListItemMoveUpButton);

    const todoListItemMoveDownButton = document.createElement("button");
    todoListItemMoveDownButton.classList.add("todo-list__item__move-up-down-wrapper__down-button");
    todoListItemMoveDownButton.type = "button";
    todoListItemMoveDownButton.addEventListener("click", (event: Event) => moveTodo(event, "down"));

    const todoListMoveDownButtonIcon = document.createElement("i");
    todoListMoveDownButtonIcon.classList.add("todo-list__item__move-up-down-wrapper__down-button__icon", "material-symbols-outlined");
    todoListMoveDownButtonIcon.textContent = "keyboard_arrow_down";
    todoListItemMoveDownButton.appendChild(todoListMoveDownButtonIcon);

    todoListItemMoveUpDownWrapper.appendChild(todoListItemMoveDownButton)
    todoListItem.appendChild(todoListItemMoveUpDownWrapper);

    const todoListItemRemoveEditWrapper = document.createElement("div");
    todoListItemRemoveEditWrapper.classList.add("todo-list__item__remove-edit-wrapper");

    const todoListItemRemoveButton = document.createElement("button");
    todoListItemRemoveButton.classList.add("todo-list__item__remove-edit-wrapper__remove-button")
    todoListItemRemoveButton.type = "button";
    todoListItemRemoveButton.title = "Remove To-Do";
    todoListItemRemoveButton.addEventListener("click", removeTodo);

    const todoListItemRemoveButtonIcon = document.createElement("i");
    todoListItemRemoveButtonIcon.classList.add("todo-list__item__remove-edit-wrapper__remove-button__icon", "material-symbols-outlined");
    todoListItemRemoveButtonIcon.textContent = "delete";
    todoListItemRemoveButton.appendChild(todoListItemRemoveButtonIcon);
    todoListItemRemoveEditWrapper.appendChild(todoListItemRemoveButton);

    const todoListItemEditButton = document.createElement("button");
    todoListItemEditButton.classList.add("todo-list__item__remove-edit-wrapper__edit-button")
    todoListItemEditButton.type = "button";
    todoListItemEditButton.title = "Edit To-Do";

    const todoListItemEditButtonIcon = document.createElement("i");
    todoListItemEditButtonIcon.classList.add("todo-list__item__remove-edit-wrapper__edit-button__icon", "material-symbols-outlined");
    todoListItemEditButtonIcon.textContent = "edit";
    todoListItemEditButton.appendChild(todoListItemEditButtonIcon);
    todoListItemRemoveEditWrapper.appendChild(todoListItemEditButton);
    todoListItem.appendChild(todoListItemRemoveEditWrapper);

    todoList.appendChild(todoListItem);
}

const addTodo = () => {
    if(!createTodoInput.value) {
        createTodo.classList.add("create-todo--error");
        createTodoInput.placeholder = "Description required!"
        return;
    }
    
    const newTodo: Todo = {
        id: Date.now(),
        description: createTodoInput.value,
        done: false,
    }
    localStorage.setItem("todos", JSON.stringify([...getSavedTodos(), newTodo]))
    
    createTodo.classList.remove("create-todo--error");
    createTodoInput.placeholder = defaultCreateTodoInputPlaceholder;
    createTodoInput.value = "";
    
    displaySingleTodo(newTodo);
    checkTodoMoveButtons();
}
createTodoButton?.addEventListener("click", addTodo);

const clearAllTodos = () => {
    localStorage.setItem("todos", JSON.stringify([]));
    todoList.innerHTML = "";
}
clearTodoListButton.addEventListener("click", clearAllTodos);

{
    getSavedTodos().forEach(item => {
        displaySingleTodo(item);
    })
    checkTodoMoveButtons();
}
