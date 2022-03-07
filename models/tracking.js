const mongoose = require("mongoose");

const tracking = new mongoose.Schema({
  car_id: {
    type: String,
    required: true,
  },
  user_id: {
    type: String,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  lattitude: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Tracking", tracking);
