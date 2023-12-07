const { MongoClient, ServerApiVersion } = require('mongodb');
const dotenv = require('dotenv');
dotenv.config({ path: "../.env" });
const uri = process.env.MONGO_CONNECTION_STRING;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

let connection;
let dbConnection;

async function initialize() {
    connection = await client.connect();
    dbConnection = await client.db("db-name");
    return dbConnection;
}

function getTasksFromUser(user) {
    return dbConnection.collection("tasks").find({"userId": user}).toArray();
}

function addTask(author, title, description, priority, status, dueDate, sharedWith) {
    return dbConnection.collection("tasks").insertOne({
        author: author,
        title: title,
        description: description,
        priority: priority,
        status: status,
        dateCreated: Date.now(),
        dueDate: dueDate,
        sharedWith: sharedWith
    });
}

function deleteTask(taskID) {
    return dbConnection.collection("tasks").findOneAndDelete({_id: taskID});
}

async function close() {
    await client.close();
}

module.exports = { mongoInit: initialize, getTasksFromUser, addTask, deleteTask, close };