const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const TaskModel = require('../models/Task');
const TaskListModel = require('../models/TaskList')
const { getUserIdFromReq } = require('../middleware/getUserIdFromReq');
const { auth } = require('express-oauth2-jwt-bearer');


const checkJwt = auth({
    audience: process.env.AUTH0_AUDIENCE,
    issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}/`,
    tokenSigningAlg: 'RS256',
});


const checkTaskOwnership = async (req, res, next) => {
    try {
        const userId = await getUserIdFromReq(req); // Get user ID from request
        const task = await TaskModel.findById(req.params.taskId);

        if (!task || task.userId !== userId) {
            return res.status(403).json({ error: 'Unauthorized access to task' });
        }
        next(); // Proceed to the next middleware/route handler
    } catch (error) {
        console.error('Error checking task ownership:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

router.get('/', checkJwt, async (req, res, next) => {
    try {
        const UID = await getUserIdFromReq(req); // Get user ID from request
        // Fetch all tasks for the user
        const tasks = await TaskModel.find({ userId: UID });
        res.json(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get a specific task by ID
router.get('/:taskId', checkJwt, checkTaskOwnership, async (req, res, next) => {
    try {
        const UID = await getUserIdFromReq(req); // Get user ID from request

        // Fetch the specific task for the user by ID
        const task = await TaskModel.findOne({ _id: req.params.taskId, userId: UID });
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.json(task);
    } catch (error) {
        console.error('Error fetching task:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create a task

router.post('/', checkJwt, async (req, res, next) => {
    try {
        const UID = await getUserIdFromReq(req); // Get user ID from request

        // Create a new task using request body data and the authenticated user's ID
        const newTaskData = {
            userId: UID,
            taskList: req.body.taskList,
            title: req.body.title || 'Untitled Task',
            description: req.body.description || 'Task Description',
            status: req.body.status || 1,
            dateDue: req.body.dateDue || new Date(),
            categories: req.body.categories || [],
        };

        const newTask = await TaskModel.create(newTaskData);

        // const taskList = await TaskListModel.findOne({ _id: req.body.taskList, userId: UID });
        // if (!taskList) {
        //     return res.status(404).json({ error: 'Task List not found' });
        // }

        // Update the Task List's tasks array to include the newly created task's ObjectId
        // taskList.tasks.push(newTask._id);
        // await taskList.save();

        res.status(201).json(newTask);
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update a task by ID
router.put('/:taskId', checkJwt, checkTaskOwnership, async (req, res, next) => {
    try {
        const UID = await getUserIdFromReq(req); // Get user ID from request

        // Update the specific task for the user by ID
        const newTaskData = {
            userId: UID,
            // taskList: req.body.taskList,
            title: req.body.title || 'Untitled Task',
            description: req.body.description || 'Task Description',
            status: req.body.status || 1,
            dateDue: req.body.dateDue || new Date(),
            categories: req.body.categories || [],
        };

        const updatedTask = await TaskModel.findOneAndUpdate(
            { _id: req.params.taskId, userId: UID },
            newTaskData,
            { new: true }
        );
        if (!updatedTask) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.json(updatedTask);
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete a task by ID
router.delete('/:taskId', checkJwt, checkTaskOwnership, async (req, res, next) => {
    try {
        const UID = await getUserIdFromReq(req); // Get user ID from request

        // Delete the specific task for the user by ID
        const taskToDelete = await TaskModel.findOne({ _id: req.params.taskId, userId: UID });
        if (!taskToDelete) {
            return res.status(404).json({ error: 'Task not found' });
        }

        // Find the associated Task List and remove the task's ObjectId from its tasks array
        // const taskList = await TaskListModel.findOne({ _id: taskToDelete.taskList, userId: UID }); // Modify this to identify the specific task list

        // if (!taskList) {
        //     return res.status(404).json({ error: 'Task List not found' });
        // }

        // taskList.tasks = taskList.tasks.filter(taskId => taskId.toString() !== req.params.taskId);
        // console.log("tasks:")
        // console.log(taskList.tasks);
        // await taskList.save();

        // Delete the task
        await TaskModel.deleteOne({ _id: req.params.taskId, userId: UID });


        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router
