const API_URL='http://localhost:3000/api/tasks/';

//CORS (Cross-Origin Resource Sharing)

let toDoList=[];

//Fetch tasks from the API

async function fetchTasks() {
    try{ //realiza consulta a base de datos
        const response= await fetch(API_URL);
        const data= await response.json();
        toDoList=data;
        console.log('Fetched tasks: ',toDoList);//recordar quitar console para no enviar datos de consola al usuario
        renderTasks();//como funciona
    } catch (error) {
        console.error('Error fetching tasks: ',error);
    }
}

const renderTasks=() => { //function renderTasks() {: funciona de la misma manera
    const tasksListElement=document.getElementById('tasks_list');
    tasksListElement.innerHTML='';
    toDoList.forEach(task => {
        const row=document.createElement('tr');
        row.innerHTML=`
            <td>${task.id}</td>
            <td>${task.title}</td>
            <td>${task.priority}</td>
            <td>${task.isCompleted ? 'Yes' : 'No'}</td>
        `;
        tasksListElement.appendChild(row);
    });
}

//Send new task into for saving it
const taskForm=document.getElementById('task-form');
taskForm.addEventListener('submit', async (event) => {
    event.preventDefault();//
    const title=document.getElementById('task-title').value;
    const priority=document.getElementById('task-priority').value;

    const newTask={ title:title, priority:priority };
    try {
        const response= await fetch(API_URL, {
            method:'POST',
            headers:{ 'Content-Type':'application/json' },
            body: JSON.stringify(newTask)
        });
        if(response.ok) {
            fetchTasks();//actualiza la lista de tareas después de agregar una nueva
            alert('Task added successfully!');
            taskForm.reset(); //limpia el formulario después de enviar la tarea
        }   
    }catch (error) {
        console.error('Error adding task: ',error.message);
    }
});

//Llamar fetch function
fetchTasks();

//SOLID- investigar principios para tener codigo limpio