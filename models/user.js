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
    type: Number,
    required: true,
  },
  usuall_check_ins: {
    type: String,
    required: false,
  },
  pickup_points: {
    type: String,
    required: false,
  },
  emergencyContact: {
    type: String,
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
  rides: {
    type: Array,
    required: false,
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

module.exports = mongoose.model("User", userSchema);
