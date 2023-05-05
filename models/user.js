const mongoose = require("mongoose");

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
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  booked_rides: {
    type: Array,
    required: false,
  },
  created_rides: {
    type: Array,
    required: false,
  },

  otp: {
    type: String,
    required: false,
  },
  otpExpiration: {
    type: Date,
    required: false,
  },
});

module.exports = mongoose.model("User", userSchema);
