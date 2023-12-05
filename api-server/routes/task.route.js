const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const TaskModel = require('../models/Task');
const { getUserIdFromReq } = require('../middleware/getUserIdFromReq');
const { auth } = require('express-oauth2-jwt-bearer');


const checkJwt = auth({
    audience: process.env.AUTH0_AUDIENCE,
    issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}/`,
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
        console.log(UID);
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
        const userId = await getUserIdFromReq(req); // Get user ID from request

        // Fetch the specific task for the user by ID
        const task = await TaskModel.findOne({ _id: req.params.taskId, userId });
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.json(task);
    } catch (error) {
        console.error('Error fetching task:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update a task by ID
router.put('/:taskId', checkJwt, checkTaskOwnership, async (req, res, next) => {
    try {
        const userId = await getUserIdFromReq(req); // Get user ID from request

        // Update the specific task for the user by ID
        const updatedTask = await TaskModel.findOneAndUpdate(
            { _id: req.params.taskId, userId },
            req.body,
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
        const userId = await getUserIdFromReq(req); // Get user ID from request

        // Delete the specific task for the user by ID
        const deletedTask = await TaskModel.findOneAndDelete({ _id: req.params.taskId, userId });
        if (!deletedTask) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router