// package imports
const express = require("express");
const app = express();
const cors = require("cors");
const https = require("https");
require("dotenv").config({ path: "./config.env" });
const port = process.env.PORT || 5001;
const { auth } = require('express-oauth2-jwt-bearer');
const mongoose = require("mongoose");
app.use(cors());
app.use(express.json());

// model imports
// const Task = require("./models/Task");
// const TaskCategory = require("./models/TaskCategory");
// const TaskList = require("./models/TaskList");
// const TaskUser = require("./models/TaskUser");

// api routes
const TaskRoute = require("./routes/task.route");
const TaskCategoryRoute = require("./routes/task-category.route")
const TaskListRoute = require("./routes/task-list.route")



app.get('/api/public', function (req, res) {

    res.json({
        message: 'Hello from a public endpoint! You don\'t need to be authenticated to see this. Token: '

    });
});


app.use('/api/task', TaskRoute);
app.use('/api/taskcategory', TaskCategoryRoute);
app.use('/api/tasklist', TaskListRoute);


app.listen(port, () => {
    // perform a database connection when server starts
    mongoose.connect(process.env.ATLAS_URI)
        .then(() => {
            console.log("Connected to MongoDB");
        })
        .catch(() => {
            console.log("Couldn't connect to MongoDB");
            // console.log(e);
        })


    console.log(`Server is running on port: ${port}`);
});