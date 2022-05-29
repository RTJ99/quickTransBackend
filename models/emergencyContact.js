const mongoose = require('mongoose');

const emergencyContact = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('EmergencyContact', emergencyContact);
