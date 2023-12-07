const dotenv = require('dotenv');
const assert = require('assert');
const {step} = require("mocha-steps");
const TaskModel = require('../models/Task');
const mongoose = require("mongoose");
dotenv.config({ path: "../.env" });

describe('Dynamic task management', () => {
  let taskID;
  step('Initialize connection', () => {
    return mongoose.connect(process.env.MONGO_CONNECTION_STRING);
  });
  step('Create task', () => {
    return TaskModel.create({
      userId: "mocha-test-user-1",
      title: "test-tile", description: "test-desc", dateDue: new Date()
    }).then(function (result) {
      taskID = result._id;
      assert.ok(taskID);
    });
  });
  step('Get task', () => {
    return TaskModel.findById(taskID).then(result => {
      assert.ok(result);
    });
  });
  step('Delete task', () => {
    return TaskModel.findByIdAndDelete(taskID).then(async () => {
      let foundTask = await TaskModel.findById(taskID);
      assert.equal(foundTask, null);
    });
  });
  step('Close connection', () => {
    return mongoose.connection.close();
  });
});