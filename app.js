const express = require('express');
const fs = require('fs');

//parsing the json from the file into json object
const tasksJson = JSON.parse(fs.readFileSync('./task.json'));
const tasksArray = tasksJson.tasks;
const tasksJsonString = JSON.stringify(tasksArray);
// console.log(tasksArray);
const app = express();
const port = 3000;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Generate a unique ID for new tasks
let nextId = 16;
const generateId = () => {
    return nextId++;
  };


// Input validation helper
 const validateTask = (task) => {
    if (!task.title || !task.description || typeof task.completed !== 'boolean') {
      return false;
    }
    return true;
  };


// GET /tasks
app.get('/', (req, res) => {
    res.status(200).send('Task Manager API');
  });

// GET /tasks
app.get('/tasks', (req, res) => {
    res.status(200).json(tasksArray);
});


// GET /tasks/:id
app.get('/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const task = tasksJson.tasks.find(t => t.id === id);
    console.log(task);
    if (!task) {
        res.status(404).json({ error: 'Task not found !!' });
    } else {
        res.status(200).json(task);
    }
});


  // POST /tasks
app.post('/tasks', (req, res) => {
    let task = req.body;
    //validating the inputs
    if (!validateTask(task)) {
        return res.status(400).json('reqquired input fields missing');
    }
    //generate new id value
    task.id = generateId();
    //push the task to task object
    tasksJson.tasks.push(task);
    //make the above changes to the file
    fs.writeFileSync('./task.json', JSON.stringify(tasksJson));
    res.status(201).json(task);
  });
  

// PUT /tasks/:id
app.put('/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const taskIndex = tasksJson.tasks.findIndex(t => t.id === id);
    if (taskIndex === -1) {
        return res.status(404).json({ error: 'Task not found !!' });
    }
    //get the body from put
    let updatedTaskDetails = req.body;
    /*update the id field also otherwise, details will be updated w/o id field
    shall optimize this to just replace with the data provided*/

    //conver the string id to int
    updatedTaskDetails.id = id;
    //validate the body 
    if (!validateTask(updatedTaskDetails)) {
        return res.status(400).json('Required input fields missing or invalid');
    }
    //update the details in the taskJson object
    tasksJson.tasks[taskIndex] = updatedTaskDetails;
    //write the same changes to the file
    fs.writeFileSync('./task.json', JSON.stringify(tasksJson));
    res.status(200).json(updatedTaskDetails);
});


// DELETE /tasks/:id
app.delete('/tasks/:id', (req, res) => {
    const id = req.params.id;
    const taskIndex = tasksJson.tasks.findIndex(t => t.id == id);
    if (taskIndex === -1) {
        return res.status(404).json({ error: 'Task not found' });
    } 
    //remove the task using its position in the json array
    tasksJson.tasks.splice(taskIndex, 1);
    //write the same changes to the file
    fs.writeFileSync('./task.json', JSON.stringify(tasksJson));
    res.status(200).json(`task with id ${id} deleted !!`)
  });

app.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server is listening on ${port}`);
});



module.exports = app;