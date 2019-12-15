const mongoose = require('mongoose');

const { Schema } = mongoose;

const bookingSchema = new Schema(
  {
    event: {
      type: Schema.Types.ObjectId,
      reference: 'Event',
    },
    user: {
      type: Schema.Types.ObjectId,
      reference: 'User',
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Booking', bookingSchema);
