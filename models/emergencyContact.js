const mongoose = require("mongoose");

const emergencyContact = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  phone: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("EmergencyContact", emergencyContact);
