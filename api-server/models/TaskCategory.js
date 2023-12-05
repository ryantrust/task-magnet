const mongoose = require('mongoose');

const TaskCategorySchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    title: {
        type: String,
        default: "Untitled Category"
    },
    color: {
        type: String,
        default: "FF0000",
    }

})



module.exports = mongoose.model('TaskCategory', TaskCategorySchema);