const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const TaskCategoryModel = require('../models/TaskCategory');
const TaskModel = require('../models/Task');
const { getUserIdFromReq } = require('../middleware/getUserIdFromReq');
const { auth } = require('express-oauth2-jwt-bearer');


const checkJwt = auth({
    audience: process.env.AUTH0_AUDIENCE,
    issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}/`,
    tokenSigningAlg: 'RS256',
});


const checkTaskCategoryOwnership = async (req, res, next) => {
    try {
        const UID = await getUserIdFromReq(req); // Get user ID from request
        const taskCategory = await TaskCategoryModel.findById(req.params.categoryId);

        if (!taskCategory || taskCategory.userId !== UID) {
            return res.status(403).json({ error: 'Unauthorized access to task category' });
        }
        next(); // Proceed to the next middleware/route handler
    } catch (error) {
        console.error('Error checking task category ownership:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

router.post('/', checkJwt, async (req, res, next) => {
    try {
        const UID = await getUserIdFromRequest(req); // Get user ID from request

        // Create a new Task Category using request body data and the authenticated user's ID
        const newCategoryData = {
            userId: UID,
            title: req.body.title || 'Untitled Category',
            color: req.body.color || 'FF0000',
        };

        const newCategory = await TaskCategoryModel.create(newCategoryData);
        res.status(201).json(newCategory);
    } catch (error) {
        console.error('Error creating Task Category:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get all Task Categories for a user
router.get('/', checkJwt, async (req, res, next) => {
    try {
        const UID = await getUserIdFromReq(req); // Get user ID from request

        // Fetch all Task Categories that match the userId
        const categories = await TaskCategoryModel.find({ userId: UID });
        res.json(categories);
    } catch (error) {
        console.error('Error fetching Task Categories:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get a specific Task Category by ID
router.get('/:categoryId', checkJwt, checkTaskCategoryOwnership, async (req, res, next) => {
    try {
        const UID = await getUserIdFromReq(req); // Get user ID from request

        // Fetch the specific Task Category by ID that matches the userId
        const category = await TaskCategoryModel.findOne({ _id: req.params.categoryId, userId: UID });
        if (!category) {
            return res.status(404).json({ error: 'Task Category not found' });
        }
        res.json(category);
    } catch (error) {
        console.error('Error fetching Task Category:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update a Task Category by ID
router.put('/:categoryId', checkJwt, checkTaskCategoryOwnership, async (req, res, next) => {
    try {
        const UID = await getUserIdFromReq(req); // Get user ID from request

        // Update the specific Task Category by ID that matches the userId
        const updatedCategory = await TaskCategoryModel.findOneAndUpdate(
            { _id: req.params.categoryId, userId: UID },
            req.body,
            { new: true }
        );
        if (!updatedCategory) {
            return res.status(404).json({ error: 'Task Category not found' });
        }
        res.json(updatedCategory);
    } catch (error) {
        console.error('Error updating Task Category:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete a Task Category by ID
router.delete('/:categoryId', checkJwt, checkTaskCategoryOwnership, async (req, res, next) => {
    try {
        const UID = await getUserIdFromReq(req); // Get user ID from request

        // Delete the specific Task Category by ID that matches the userId
        const taskCategory = await TaskCategoryModel.findById({ _id: req.params.categoryId, userId: UID });
        if (!taskCategory) {
            return res.status(404).json({ error: 'Task Category not found' });
        }

        // Update all tasks referencing the Task Category
        await TaskModel.updateMany(
            { categories: req.params.categoryId },
            { $pull: { categories: req.params.categoryId } }
        );

        // Now delete the TaskCategory
        await taskCategory.remove();

        res.json({ message: 'Task Category deleted successfully' });
    } catch (error) {
        console.error('Error deleting Task Category:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;