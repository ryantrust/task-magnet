const mongoHandler = require("../mongo");
const {ObjectId} = require("mongodb");
const assert = require('assert');

it('Initialize database', mongoHandler.initialize).timeout(20 * 1000);

it('Get task', () => {
    mongoHandler.getTasksFromUser(new ObjectId('656aa4f54d05409988700467')).then(results => {
        assert.ok(results.some(result => result._id === new ObjectId('656be3bd1d74cf029391341b')));
    });
});

it('Close connection', mongoHandler.close);