const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const moment = require('moment');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const port = 8000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log('Connected to database');
}).catch(() => {
    console.log('Connection failed');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});