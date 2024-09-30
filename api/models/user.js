const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required:true,
    },
    firstName:
    {
        type: String,
        required: true
    },
    lastName:{
        type: String,
    },
    image:{
        type: String,
        required: true
    },
    skill:{
        type: String,
    },
    noOfEvents:{
        type: Number,
        default:0,
    },
})