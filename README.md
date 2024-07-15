# task_manager
first crud api using node js
This repo consists of task manager CRUD api representing a simple task app using node js, express js and some NPM packages.

***For dev purpose we're not using any DB, instead we're storing some sample json data in a file named task.json in the root directory of the application.*** 

There are 5 endpoints:
GET /tasks -> this retrieves the list of all tasks from the task.json file 

GET /tasks/:id -> retrieves the task with the given id

POST /tasks -> creates new task with required inputs in the task.json file

PUT /tasks/:id -> updates the specific task with new details from the task.json file

DELETE /tasks/:id -> deletes the task with the given id from the task.json file

STEPS to run:
 1. make sure first you have node run time environment installed in your machine
 2. clone the project from the main branch
 3. open the project directory in terminal
 4. run #node app.js
 5. you should see the output in the terminal "Server is listening on 3000"
 6. now open any REST client such as Postman and test each of the endpoint and verify the output
