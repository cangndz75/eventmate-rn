const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    image: {
      type: String,
      required: true,
    },
    skill: {
      type: String,
    },
    noOfEvents: {
      type: Number,
      default: 0,
    },
    eventPals: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    events: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
      },
    ],
    badges: [
      {
        type: String, 
        earnedAt: { type: Date, default: Date.now },
      },
    ],
    level: {
      type: Number,
      default: 1,
    },
    points: { 
      type: Number,
      default: 0,
    },
    isOrganizer:{
      type: Boolean,
      default: false,
    }
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model('User', userSchema);

module.exports = User;
