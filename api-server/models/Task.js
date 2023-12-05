const mongoose = require('mongoose');
const TaskSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    taskList: {
        type: mongoose.Types.ObjectId,
        ref: "TaskList"
    },
    title: {
        type: String,
        default: "Untitled Task"
    },

    description: {
        type: String,
        default: "Task Description"
    },
    status: { // 1 = not started, 2 = in progress, 3 = completed
        type: Number,
        default: 1,
    },
    dateCreated: {
        type: Date,
        default: Date.now
    },
    dateDue: {
        type: Date,
    },
    categories: [{
        type: mongoose.Types.ObjectId,
        ref: "TaskCategory"
    }]

})
const Task = mongoose.model('Task', TaskSchema);

module.exports = Task;