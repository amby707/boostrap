const express = require('express');
const db = require('./db');
const cors = require('cors');

const app = express();

//Middlewares -Decirle que autorice las piliticas del dominio
app.use(cors());

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hola Mundo');
});

//get: enviar informacion, post: recibir informacion, 
// put: actualizar informacion, delete: eliminar informacion

app.get('/api/tasks/', async (req, res) => {
    try {
        const [tasks] = await db.query ('SELECT * FROM tasks');
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/tasks/:id',async (req, res) => {
    const { id } = req.params;
    try {
        const [task] = await db.query('SELECT * FROM tasks WHERE id = ?', [id]);
        if (task.length === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.json(task[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/tasks/', async (req, res) => {
    const query= "insert into tasks (title, priority, isCompleted) values (?, ?, ?)";
    const {title, priority}= req.body;
    try {
        const [result] = await db.query(query, [title, priority, false]);
        res.status(201).json({ id: result.insertId, title, priority, isCompleted: false });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/tasks/:id',async (req, res) => {
    const { id } = req.params;
    const { title, priority, isCompleted } = req.body;
    try {
    const query = "UPDATE tasks SET title = ?, priority = ?, isCompleted = ? WHERE id = ?";
    const [result]= await db.query(query, [title, priority, isCompleted, id]);
    res.json({ id, title, priority, isCompleted });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.delete('/api/tasks/:id',async (req, res) => {
    const { id } = req.params;
    try {
        const query = "DELETE FROM tasks WHERE id = ?";
        const [result] = await db.query(query, [id]);
        res.json({ message: `Task with id ${id} deleted` });
    } catch (error) {
        res.status(500).json({ error: error.message });

    }
});


//.get(/tasks/) consultar todas las tareas
//.get(/tasks/:id) consultar una tarea por id
//.post(/tasks/) crear una nueva tarea
//.put(/tasks/:id) actualizar una tarea por id
//.delete(/tasks/:id) eliminar una tarea por id

app.listen(3000, () => {
    console.log('Servidor iniciado en el puerto 3000');
});