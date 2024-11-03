const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const communitySchema = new Schema(
  {
    name: {type: String, required: true},
    description: {type: String, required: true},
    profileImage: {type: String},
    headerImage: {type: String},
    tags: [String],
    isPrivate: {type: Boolean, default: false},
    links: [String],
    members: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    joinRequests: [
      {
        userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        answers: {type: Map, of: String},
        status: {
          type: String,
          enum: ['pending', 'accepted', 'rejected'],
          default: 'pending',
        },
      },
    ],
    events: [{type: mongoose.Schema.Types.ObjectId, ref: 'Event'}],
    posts: [
      {
        author: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        content: String,
        image: String,
        createdAt: {type: Date, default: Date.now},
      },
    ],
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {timestamps: true},
);

module.exports = mongoose.model('Community', communitySchema);
