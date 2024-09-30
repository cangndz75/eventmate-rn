const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const moment = require('moment');

const app = express();
const port = 8000;
const cors = require('cors');
app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const jwt = require('jsonwebtoken');

mongoose.connect("mongodb+srv://cangunduz0001:159753sk@cluster0.2gmiv.mongodb.net/eventmate?retryWrites=true&w=majority&appName=Cluster0")
.then(() => {
    console.log('Connected to database');
}).catch(() => {
    console.log('Connection failed');
});

app.listen(port,() => {
    console.log(`Server is running on port ${port}`);
})