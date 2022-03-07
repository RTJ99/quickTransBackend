const mongoose = require("mongoose");

const searchRide = new mongoose.Schema({
  drop_off_location: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  seats: {
    type: Number,
    required: true,
  },
  preferences: {
    type: Array,
    required: false,
  },
  pickup_point: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model("SearchRide", searchRide);
