const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const TaskListModel = require('../models/TaskList');
const TaskModel = require('../models/Task');
const { getUserIdFromReq } = require('../middleware/getUserIdFromReq');
const { auth } = require('express-oauth2-jwt-bearer');


const checkJwt = auth({
    audience: process.env.AUTH0_AUDIENCE,
    issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}/`,
    tokenSigningAlg: 'RS256',
});


const checkTaskListOwnership = async (req, res, next) => {
    try {
        const UID = await getUserIdFromReq(req); // Get user ID from request
        const taskList = await TaskListModel.findById(req.params.listId);

        if (!taskList || taskList.userId !== UID) {
            return res.status(403).json({ error: 'Unauthorized access to task List' });
        }
        next(); // Proceed to the next middleware/route handler
    } catch (error) {
        console.error('Error checking task List ownership:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


// Create a new Task List
router.post('/', checkJwt, async (req, res) => {
    try {
        const UID = await getUserIdFromReq(req); // Get user ID from request

        const newTaskList = {
            userId: UID,
            title: req.body.title || 'Untitled Task List',
            description: req.body.description || 'Task List Description',
            tasks: [], // Initialize tasks array
        };

        const createdTaskList = await TaskListModel.create(newTaskList);
        res.status(201).json(createdTaskList);
    } catch (error) {
        console.error('Error creating Task List:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get all Task Lists for a user
router.get('/', checkJwt, async (req, res) => {
    try {
        const UID = await getUserIdFromReq(req); // Get user ID from request

        const taskLists = await TaskListModel.find({ userId: UID }).populate('tasks'); // Populate tasks array
        res.json(taskLists);
    } catch (error) {
        console.error('Error fetching Task Lists:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get a specific Task List by ID
router.get('/:listId', checkJwt, checkTaskListOwnership, async (req, res) => {
    try {
        const UID = await getUserIdFromReq(req); // Get user ID from request

        const taskList = await TaskListModel.findOne({ _id: req.params.listId, userId: UID }).populate('tasks'); // Populate tasks array
        if (!taskList) {
            return res.status(404).json({ error: 'Task List not found' });
        }
        res.json(taskList);
    } catch (error) {
        console.error('Error fetching Task List:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update a Task List by ID
router.put('/:listId', checkJwt, checkTaskListOwnership, async (req, res) => {
    try {
        const UID = await getUserIdFromReq(req); // Get user ID from request

        const updatedTaskList = {
            title: req.body.title,
            description: req.body.description,
        };

        const existingTaskList = await TaskListModel.findOne({ _id: req.params.listId, userId: UID });
        if (!existingTaskList) {
            return res.status(404).json({ error: 'Task List not found' });
        }

        updatedTaskList.tasks = existingTaskList.tasks; // Preserve existing tasks array
        const updatedList = await TaskListModel.findOneAndUpdate(
            { _id: req.params.listId, userId: UID },
            updatedTaskList,
            { new: true }
        ).populate('tasks'); // Populate tasks array

        res.json(updatedList);
    } catch (error) {
        console.error('Error updating Task List:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete a Task List by ID
router.delete('/:listId', checkJwt, checkTaskListOwnership, async (req, res) => {
    try {
        const UID = await getUserIdFromReq(req); // Get user ID from request

        const deletedTaskList = await TaskListModel.findById(req.params.listId);
        if (!deletedTaskList) {
            return res.status(404).json({ error: 'Task List not found' });
        }
        const tasksToDelete = await TaskModel.find({ taskList: req.params.listId });

        if (tasksToDelete.length > 0) {
            // Delete all associated tasks
            await TaskModel.deleteMany({ taskList: req.params.listId });
        }

        // Now delete the TaskList
        await TaskListModel.findByIdAndDelete(req.params.listId);

        res.json({ message: 'Task List and associated tasks deleted successfully' });

    } catch (error) {
        console.error('Error deleting Task List:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;