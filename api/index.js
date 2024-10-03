const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const moment = require('moment');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const User = require('./models/user');
const Event = require('./models/event');
const Venue = require('./models/venue');

const app = express();
const port = 8000;

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to database');
  })
  .catch(() => {
    console.log('Connection failed');
  });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.post('/register', async (req, res) => {
  try {
    const userData = req.body;
    const newUser = new User(userData);

    await newUser.save();

    const secretKey = crypto.randomBytes(32).toString('hex');
    const token = jwt.sign({id: newUser._id}, secretKey);

    res.status(200).json({token});
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/login', async (req, res) => {
  try {
    const {email, password} = req.body;

    const user = await User.findOne({email});

    if (!user) {
      return res.status(404).send('User not found');
    }
    if (user.password !== password) {
      return res.status(401).send('Invalid password');
    }
    const secretKey = crypto.randomBytes(32).toString('hex');
    const token = jwt.sign({id: user._id}, secretKey);
    res.status(200).json({token});
  } catch (error) {
    console.log(error);
  }
});
