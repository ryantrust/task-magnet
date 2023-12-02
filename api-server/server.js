const express = require('express');
const cors = require('cors');
const router = require('./routes/router');
const app = express();

//listening to port 3000 for incoming requests 
//integrate Auth0 authentication services 

const corsOptions = {
    origin: '*', 
    credentials: true, 
    optionSuccessStatus: 200
}

app.use(cors(corsOptions));
app.use(express.json());
app.use('/', router);

const port = 4000 
const server = app.listen(port, () => {
    console.log('Backend server is running on port ${port}')
})




