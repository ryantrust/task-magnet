const mongoose = require('mongoose');
const TaskModel = require('../models/Task');
const TaskListSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    title: {
        type: String,
        default: "Untitled Task List"
    },
    description: {
        type: String,
        default: "Task List Description",
    },
    tasks: [{
        type: mongoose.Types.ObjectId,
        ref: "Task"
    }]

})



module.exports = mongoose.model('TaskList', TaskListSchema);