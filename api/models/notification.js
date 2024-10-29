const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  message: {type: String, required: true},
  from: {
    firstName: String,
    lastName: String,
    image: String,
  },
  createdAt: {type: Date, default: Date.now},
});

module.exports = mongoose.model('Notification', notificationSchema);
