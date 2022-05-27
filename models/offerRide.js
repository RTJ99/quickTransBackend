const mongoose = require("mongoose");

const offerRide = new mongoose.Schema({
  drop_off_location: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: false,
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
    required: true,
  },
  summary: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    required: true,
  },

  amount: {
    type: String,
    required: true,
  },

  dropOffLat: {
    type: String,
    required: true,
  },
  pickupLat: {
    type: String,
    required: true,
  },
  dropOffLng: {
    type: String,
    required: true,
  },
  pickupLng: {
    type: String,
    required: true,
  },
  rating: {
    type: Array,
    required: false,
  },
  passengers: {
    type: Array,
    required: false,
  },
  passengersPending: {
    type: Array,
    required: false,
  },
  plate: {
    type: String,
    required: true,
  },
  make: {
    type: String,
    required: true,
  },
  // driver_id: {
  //   type: String,
  //   required: true,
  // },
  // capacity: {
  //   type: Number,
  //   required: true,
  // },
  summary: {
    type: String,
    required: false,
  },
  driver: {
    type: String,
    required: true,
  },
  driver_pic: {
    type: String,
    required: true,
  },
  picture: {
    type: String,
    required: true,
  },
  cloudinary_id: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("OfferRide", offerRide);
