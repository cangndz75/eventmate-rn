const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema(
  {
    title: {type: String, required: true},
    eventType: {
      type: String,
      enum: ['concert', 'football', 'theater', 'dance', 'other'],
      required: true,
    },
    location: {type: String, required: true},
    date: {type: Date, required: true},
    time: {type: String, required: true},
    totalParticipants: {type: Number, required: true},
    description: {type: String},
    tags: [String],
    images: [String],
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    attendees: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
  },
  {timestamps: true},
);

module.exports = mongoose.model('Event', eventSchema);
