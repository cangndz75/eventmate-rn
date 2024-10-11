const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  icon: {
    type: String,
  },
  criteria: {
    type: String,
    required: true,
  },
  points: {
    type: Number,
    required: true,
  },
}, {
  timestamps: true,
});

const Badge = mongoose.model('Badge', badgeSchema);
module.exports = Badge;
