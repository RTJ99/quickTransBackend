const router = require("express").Router();
const cloudinary = require("../utils/cloudinary");
const upload = require("../utils/multer");
const Rating = require("../models/rating");

router.get("/", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(id)) return false;
});

module.exports = router;
