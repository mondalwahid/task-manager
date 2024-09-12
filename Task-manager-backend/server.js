const express = require('express');
const cors = require('cors');
const app = express();
const port = 8000;

app.use(express.json()); 
app.use(cors({
  origin: 'http://localhost:3000' 
}));


let tasks = [];
let currentId = 1;


app.get('/tasks', (req, res) => {
  res.json(tasks);
});


app.get('/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const task = tasks.find(t => t.id === taskId);
  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }
  res.json(task);
});


app.post('/tasks', (req, res) => {
  const { title, description, priority, status } = req.body;

  if (!title || !priority || !status) {
    return res.status(400).json({ message: 'Title, priority, and status are required' });
  }

  const newTask = {
    id: currentId++,
    title,
    description: description || '', 
    priority,
    status
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});


app.put('/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const { title, description, priority, status } = req.body;

  const taskIndex = tasks.findIndex(t => t.id === taskId);
  if (taskIndex === -1) {
    return res.status(404).json({ message: 'Task not found' });
  }

  tasks[taskIndex] = {
    ...tasks[taskIndex],
    title: title || tasks[taskIndex].title,
    description: description || tasks[taskIndex].description,
    priority: priority || tasks[taskIndex].priority,
    status: status || tasks[taskIndex].status
  };

  res.json(tasks[taskIndex]);
});

app.delete('/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const taskIndex = tasks.findIndex(t => t.id === taskId);
  if (taskIndex === -1) {
    return res.status(404).json({ message: 'Task not found' });
  }

  tasks.splice(taskIndex, 1);
  res.status(204).send(); 
});

app.delete('/tasks', (req, res) => {
    tasks = []; 
    res.status(204).send(); 
  });


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
