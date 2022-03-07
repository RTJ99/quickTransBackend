const mongoose = require("mongoose");

const rating = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
  },
  rating_num: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Rating", rating);
