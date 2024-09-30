const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const venueSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
  },
  image: {
    type: String,
  },
  deferLink: {
    type: String,
  },
  fullLink: {
    type: String,
  },
  avgRating: {
    type: Number,
  },
  ratingCount: {
    type: Number,
  },
  lat: {
    type: Number,
  },
  lng: {
    type: Number,
  },
  icon: {
    type: String,
  },
  filter_by: [String],
  eventsAvailable: [
    {
      id: String,
      name: String,
      icon: String,
      price: Number,
      courts: [
        {
          id: String,
          name: String,
          number: Number,
        },
      ],
    },
  ],
  location: String,
  address: {
    type: String,
    required: true,
  },
  bookings: [
    {
      courtNumber: {
        type: String,
        required: true,
      },
      date: {
        type: String,
        required: true,
      },
      time: {
        type: String,
        required: true,
      },
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
      },
    },
  ],
  reviews: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true,
      },
      comment: {
        type: String,
      },
      reviewedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

const Venue = mongoose.model('Venue', venueSchema);

module.exports = Venue;
