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

const displaySingleTodo = (todo: Todo) => {
    const todoListItem = document.createElement("article");
    todoListItem.classList.add("todo-list__item");
    todoListItem.id = todo.id.toString();

    const todoListItemCheckbox = document.createElement("input");
    todoListItemCheckbox.classList.add("todo-list__item__checkbox")
    todoListItemCheckbox.type = "checkbox";
    todoListItemCheckbox.checked = todo.done;
    todoListItem.appendChild(todoListItemCheckbox);

    const todoListItemDescription = document.createElement("p");
    todoListItemDescription.classList.add("todo-list__item__description");
    todoListItemDescription.textContent = `${todo.description}`;
    todoListItem.appendChild(todoListItemDescription);

    const todoListItemRemoveEditWrapper = document.createElement("div");
    todoListItemRemoveEditWrapper.classList.add("todo-list__item__remove-edit-wrapper");

    const todoListItemRemoveButton = document.createElement("button");
    todoListItemRemoveButton.classList.add("todo-list__item__remove-edit-wrapper__remove-button")
    todoListItemRemoveButton.type = "button";
    todoListItemRemoveButton.title = "Remove To-Do";

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
}
createTodoButton?.addEventListener("click", addTodo);

const removeTodo = () => {

}

const editTodo = () => {

}

const moveTodo = () => {
    //vg funktion: drag drop move items
}

const clearAllTodos = () => {
    localStorage.setItem("todos", JSON.stringify([]));
    todoList.innerHTML = "";
}
clearTodoListButton.addEventListener("click", clearAllTodos);

getSavedTodos().forEach(item => {
    displaySingleTodo(item);
})
