const eventSchema = new Schema({
  title: { type: String, required: true },
  eventType: {
    type: String,
    enum: ['concert', 'football', 'theater', 'dance', 'other'],
    required: true,
  },
  location: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  totalParticipants: { type: Number, required: true },
  description: { type: String },
  tags: [String],
  images: [String],
  isPaid: { type: Boolean, default: false },
  price: { type: Number },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  requests: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      comment: { type: String },
      status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending',
      },
    },
  ],
  reviews: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      review: { type: String, required: true },
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
