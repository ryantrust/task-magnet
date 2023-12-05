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


router.get('/', checkJwt, async function (req, res, next) { // get all tasks


    const userid = await getUserIdFromReq(req);
    console.log(userid);
    res.json({
        message: 'Hello from a private endpoint! You need to be authenticated to see this. Your userid is ' + userid
    });
});

module.exports = router