const mongoose = require("mongoose");

const carSchema = new mongoose.Schema({
  plate: {
    type: String,
    required: true,
  },
  make: {
    type: String,
    required: true,
  },
  capacity: {
    type: Number,
    required: true,
  },
  summary: {
    type: String,
    required: false,
  },
  driver: {
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

module.exports = mongoose.model("Car", carSchema);
