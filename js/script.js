const todos = [];
const RENDER_EVENT = 'render-todo';
const input_title = document.getElementById('todo-title')

document.addEventListener('DOMContentLoaded', () => {
    const form_submit = document.getElementById('form-section');
    let hiddenText = document.getElementById('char-left')
    
    // If Submit button clicked
    form_submit.addEventListener('submit', (event) => {
        // Reset Input
        input_title.innerText = "";
        document.getElementById('todo-date').innerText = "";
        event.preventDefault(event);
        addToList();
    });
    
    const max_input = input_title.getAttribute('maxlength');
    
    input_title.addEventListener('focus', () => {
        hiddenText.style.visibility = 'visible';
        input_title.addEventListener('input', () => {
            const title_length = input_title.value.length;
            let char_left = max_input - title_length;
            // Add innerText
            hiddenText.innerText = char_left + " Character Left";
            hiddenText.style.marginTop = "3px";
            hiddenText.style.float = "right";
        })
    })

    input_title.addEventListener('blur', () => {
        hiddenText.style.visibility = 'hidden';
    });
});

// Generate ID and Object
const generateId = () => +new Date
const generateTodoObject = (id, title, estimated_date, isCompleted) => {return {id, title, estimated_date, isCompleted}};
const getTodoItemByID = todoId => {
    for(const item of todos) {
        if(item.id == todoId) return item;
    }
    return null;
}
const findTodo = (todoId) => {
    for(const item in todos) {
        if(todos[item].id == todoId) return item;
    }
    return -1;
}

/* CRUD Statement */
// Add Todo
const addToList = () => {
    const getTitle = input_title.value; 
    const getDate = document.getElementById('todo-date').value;

    // Generatin unique id from function and push todo
    const generateID = generateId();
    const makeTodoObject = generateTodoObject(generateID, getTitle, getDate, false);
    todos.push(makeTodoObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
};

const makeList = (listTodoObject) => {
    // Create element for title 
    const textTitle = document.createElement('h4');
    textTitle.innerText = listTodoObject.title;

    // Create elemet fot finished date
    const finished_date = document.createElement('p')
    finished_date.innerText = listTodoObject.estimated_date;

    // Create container for all element
    const itemsContainer = document.createElement('div');
    itemsContainer.setAttribute('class', 'inner-div');
    itemsContainer.append(textTitle, finished_date);

    // Create Parent Container
    const root_items = document.createElement('div');
    root_items.setAttribute('class', 'outer');
    root_items.setAttribute('id', `id-${listTodoObject.id}`);
    root_items.append(itemsContainer);

    // Container for icons
    const icon_container = document.createElement('div');
    icon_container.setAttribute('class', 'icon-container');

    if(listTodoObject.isCompleted) {

        const makeUndoButton = document.createElement('button');
        makeUndoButton.classList.add('undo-button');

        makeUndoButton.addEventListener('click', () => {
            undoTask(listTodoObject.id)
        });

        const deleteTask = document.createElement('button');
        deleteTask.classList.add('delete-button');
        
        deleteTask.addEventListener('click', () => {
            removeTask(listTodoObject.id);
        });

        icon_container.append(makeUndoButton, deleteTask);
        root_items.append()
    } else {
        const checkButton = document.createElement('button');
        checkButton.classList.add('finish-button');

        checkButton.addEventListener('click', () => {
            addListIntoComplete(listTodoObject.id);
        });
        icon_container.append(checkButton);
    }
    root_items.append(icon_container);
    return root_items;
}

// Finishing Task
const addListIntoComplete = todoId => {
    const todoTarget = getTodoItemByID(todoId);
    if(todoTarget == null) return;
    todoTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT))
}

// Undo Checked List
const undoTask = (todoId) => {
    const target = getTodoItemByID(todoId);
    if(target == null) return;
    target.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
}

// Delete task
const removeTask = (todoId) => {
    const target = findTodo(todoId);
    if(target == null) return;
    todos.splice(target, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
}

// Trigger to make object
document.addEventListener(RENDER_EVENT, function () {
    // Unfinished Todo
    const uncompletedTODO = document.getElementById('todos');
    uncompletedTODO.innerHTML = '';

    // Finisihed Todo
    const checkedTodo = document.getElementById('finished-todo');
    checkedTodo.innerHTML = '';

    for (const items of todos) {
        const itemCreated = makeList(items);
        if(!items.isCompleted) {
            uncompletedTODO.append(itemCreated);
        } else {
            checkedTodo.append(itemCreated);
        }
    }
});