const mongoHandler = require("../mongo");
const {ObjectId} = require("mongodb");
const assert = require('assert');
const {step} = require("mocha-steps");

it('Initialize database', mongoHandler.mongoInit).timeout(20 * 1000);

it('Get static task', () => {
    return mongoHandler.getTasksFromUser("auth0|656aa4f54d05409988700467").then(results => {
        assert.ok(results.some(result => result._id.equals('656be3bd1d74cf029391341b')));
    });
});

it('Close connection', mongoHandler.close);

describe('Dynamic task management', () => {
    let taskID;
    step('Initialize connection', mongoHandler.mongoInit);
    step('Create task', () => {
        return mongoHandler.addTask("mocha-test-user-1",
            "test-title", "test-desc", 0, 0,
            Date.now(), ["mocha-test-user-2"]).then(result => {
                assert.ok(result.acknowledged);
                taskID = result.insertedId;
        });
    });
    step('Get task', () => {
        return mongoHandler.getTasksFromUser("mocha-test-user-1").then(results => {
            assert.ok(results.some(result => result._id.equals(taskID)));
        });
    });
    step('Delete task', () => {
        return mongoHandler.deleteTask(taskID).then(async result => {
            assert.ok(result);
            await mongoHandler.getTasksFromUser("mocha-test-user-1").then(results => {
                assert.ok(!results.some(result => result._id.equals(taskID)));
            });
        });
    });
    step('Close connection', mongoHandler.close);
});