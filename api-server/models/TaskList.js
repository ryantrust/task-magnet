const mongoose = require('mongoose');
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
    taskLists: [{
        type: mongoose.Types.ObjectId,
        ref: "TaskList"
    }]

})
module.exports = mongoose.model('TaskList', TaskListSchema);