const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const communitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String },  // Image URL for community profile picture
  tags: [String],
  isPrivate: { type: Boolean, default: false },
  questions: {
    type: Map,
    of: String,
    default: {},  // Questions for private communities
  },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  joinRequests: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      answers: { type: Map, of: String },
      status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' }
    }
  ],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Community', communitySchema);
