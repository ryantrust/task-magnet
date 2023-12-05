const mongoose = require('mongoose');
const TaskUserSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    taskLists: [{
        type: mongoose.Types.ObjectId,
        ref: "TaskList"
    }],
    taskCategories: [{
        type: mongoose.Types.ObjectId,
        ref: "TaskCategory"
    }]

})
module.exports = mongoose.model('TaskUser', TaskUserSchema);