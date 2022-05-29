const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  usuall_check_ins: {
    type: Array,
    required: false,
  },
  pickup_points: {
    type: Array,
    required: false,
  },
  created_rides: {
    type: Array,
    required: false,
  },
  booked_rides: {
    type: Array,
    required: false,
  },
  password: {
    type: String,
    required: false,
  },
  address: {
    type: String,
    required: true,
  },
  picture: {
    type: String,
    required: true,
  },
  nextRide: {
    type: String,
    required: false,
  },
  cloudinary_id: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('User', userSchema);
