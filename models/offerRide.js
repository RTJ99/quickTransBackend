const mongoose = require("mongoose");

const offerRide = new mongoose.Schema({
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
  pickup_points: {
    type: Array,
    required: false,
  },
  summary: {
    type: String,
    required: false,
  },
  car: {
    type: String,
    required: true,
  },
  picture: {
    type: String,
    required: true,
  },
  amount: {
    type: String,
    required: true,
  },
  cloudinary_id: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("OfferRide", offerRide);
