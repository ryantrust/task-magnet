const express = require("express");
const router = express.Router();
const TaskModel = require("../models/Task");
const {getUserIdFromReq} = require("../middleware/getUserIdFromReq");
const {auth} = require("express-oauth2-jwt-bearer");
const {getTasksFromUser} = require("../mongo");

const checkJwt = auth({
    audience: process.env.REACT_APP_AUTH0_AUDIENCE,
    issuerBaseURL: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/`,
    tokenSigningAlg: 'RS256',
});

router.use(checkJwt);

router.get("/", async function (req, res, next) {
    const userid = await getUserIdFromReq(req);
    //console.log(userid);
    res.json({
        message:
            "Hello from a private endpoint! You need to be authenticated to see this. Your userid is " +
            userid,
    });
});

router.get("/tasks", async function (req, res, next) {
    // get all tasks

    const userid = await getUserIdFromReq(req);
    const tasks = await getTasksFromUser(userid);
    //console.log(userid);
    res.json({
        tasks: tasks
    });
});

module.exports = router;
