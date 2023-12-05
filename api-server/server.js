// package imports
const express = require("express");
const app = express();
const cors = require("cors");
const https = require("https");
const dotenv = require("dotenv");
dotenv.config({ path: "../.env" });
const port = process.env.API_PORT;
const { auth } = require("express-oauth2-jwt-bearer");
const mongoose = require("mongoose");
app.use(cors());
app.use(express.json());

// model imports
const Task = require("./models/Task");
const TaskCategory = require("./models/TaskCategory");
const TaskList = require("./models/TaskList");
const TaskUser = require("./models/TaskUser");

// api routes
const TaskRoute = require("./routes/task.route");
const {mongoInit} = require("./mongo");
auth({
  audience: process.env.REACT_APP_AUTH0_AUDIENCE,
  issuerBaseURL: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/`,
});
mongoInit();

app.get("/api/public", function (req, res) {
  res.json({
    message:
      "Hello from a public endpoint! You don't need to be authenticated to see this. Token: ",
  });
});

app.use("/api/private", TaskRoute);

// This route needs authentication
// app.get('/api/private', checkJwt, async function (req, res, next) {

//     const userid = await authUser(req);
//     console.log(userid);
//     res.json({
//         message: 'Hello from a private endpoint! You need to be authenticated to see this. Your userid is ' + userid
//     });
// });

app.listen(port, () => {
  // perform a database connection when server starts
  mongoose
    .connect(process.env.MONGO_CONNECTION_STRING)
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch(() => {
      console.log("Couldn't connect to MongoDB");
      // console.log(e);
    });
  console.log(`Server is running on port: ${port}`);
});
