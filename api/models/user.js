const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
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
    noOfEvents: {type: Number, default: 0},
    eventPals: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    events: [{type: mongoose.Schema.Types.ObjectId, ref: 'Event'}],
    role: {
      type: String,
      enum: ['user', 'organizer'],
      default: 'user',
    },
    favorites: [{type: mongoose.Schema.Types.ObjectId, ref: 'Event'}],
    interests: [{type: String}],
    aboutMe: {type: String, default: ''},
    isPrivate: {type: Boolean, default: false},
    tokenExpiresIn: { type: Number, default: 3600 },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model('User', userSchema);
module.exports = User;
