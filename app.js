const express = require('express');
const fs = require('fs');

//parsing the json from the file into json object
const tasksJson = JSON.parse(fs.readFileSync('./task.json'));
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
    if (!task.title || !task.description) {
      throw new Error('Title and description are required');
    }
    if (typeof task.completed !== 'boolean') {
      throw new Error('Completed must be a boolean');
    }
  };


// GET /tasks
app.get('/', (req, res) => {
    res.json("welcome to tasks api");
  });

// GET /tasks
app.get('/tasks', (req, res) => {
    res.status(200).json(tasksJson);
  });
  
  
// GET /tasks/:id
app.get('/tasks/:id', (req, res) => {
    const id = req.params.id;
    const task = tasksJson.tasks.find(t => t.id == id);
    if (!task) {
        res.status(404).json({ error: 'Task not found !!' });
    } else {
        res.status(200).json(task);
    }
});


  // POST /tasks
app.post('/tasks', (req, res) => {
    try {
            let task = req.body;
            //validating the inputs
            validateTask(task);
            //generate new id value
            task.id = generateId();
            //push the task to task object
            tasksJson.tasks.push(task);
            //make the above changes to the file
            fs.writeFileSync('./task.json', JSON.stringify(tasksJson));
            res.status(201).json(task);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
  });
  

// PUT /tasks/:id
app.put('/tasks/:id', (req, res) => {
    const id = req.params.id;
    const taskIndex = tasksJson.tasks.findIndex(t => t.id == id);
    if (taskIndex === -1) {
        res.status(404).json({ error: 'Task not found !!' });
    } else {
        try {
            //get the body from put
            let updatedTaskDetails = req.body;
            /*update the id field also otherwise, details will be updated w/o id field
            shall optimize this to just replace with the data provided*/

            //conver the string id to int
            updatedTaskDetails.id = parseInt(id);
            //validate the body 
            validateTask(updatedTaskDetails);
            //update the details in the taskJson object
            tasksJson.tasks[taskIndex] = updatedTaskDetails;
            //write the same changes to the file
            fs.writeFileSync('./task.json', JSON.stringify(tasksJson));
            res.status(200).json(updatedTaskDetails);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }
});


// DELETE /tasks/:id
app.delete('/tasks/:id', (req, res) => {
    const id = req.params.id;
    const taskIndex = tasksJson.tasks.findIndex(t => t.id == id);
    if (taskIndex === -1) {
        res.status(404).json({ error: 'Task not found' });
    } else {
        //remove the task using its position in the json array
        tasksJson.tasks.splice(taskIndex, 1);
        //write the same changes to the file
        fs.writeFileSync('./task.json', JSON.stringify(tasksJson));
        res.status(200).json(`task with id ${id} deleted !!`)
    }
  });

app.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server is listening on ${port}`);
});



module.exports = app;