const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config({ path: "../.env" });

const app = express();

app.use(cors());
app.use(express.json());