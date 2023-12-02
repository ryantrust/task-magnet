const express = require('express');
const cors = require('cors');
const router = require('./routes/router');
const dotenv = require('dotenv');
const app = express();

dotenv.config({ path: "../.env" });

// TODO: integrate Auth0 authentication services

const corsOptions = {
    origin: '*', 
    credentials: true, 
    optionSuccessStatus: 200
}

app.use(cors(corsOptions));
app.use(express.json());
app.use('/', router);

const port = process.env.API_PORT;
const server = app.listen(port, () => {
    console.log('Backend server is running on port ${port}');
});




