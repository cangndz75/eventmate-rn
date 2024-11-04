const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const communitySchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    profileImage: { type: String },
    headerImage: { type: String },
    tags: [String],
    isPrivate: { type: Boolean, default: false },
    links: [String],
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    joinRequests: [
      {
        userId: { type: Schema.Types.ObjectId, ref: 'User' },
        answers: { type: Map, of: String },
        status: {
          type: String,
          enum: ['pending', 'accepted', 'rejected'],
          default: 'pending',
        },
      },
    ],
    organizer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    events: [{ type: Schema.Types.ObjectId, ref: 'Event' }],
    posts: [
      {
        author: { type: Schema.Types.ObjectId, ref: 'User' },
        content: String,
        image: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);


module.exports = mongoose.model('Community', communitySchema);
