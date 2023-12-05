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

async function getTasksFromUser(user) {
    let results = await dbConnection.collection("tasks").find({"author": user});
    return await results.toArray();
}

async function close() {
    await client.close();
}

module.exports = { mongoInit: initialize, getTasksFromUser, close };