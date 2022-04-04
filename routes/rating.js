const router = require("express").Router();
const cloudinary = require("../utils/cloudinary");
const upload = require("../utils/multer");
const Rating = require("../models/rating");

router.post("/", upload.single("image"), async (req, res) => {
  try {
    // Create new rating
    let rating = new Rating({
      user_id: req.body.user_id,
      number: req.body.number,
    });
    // Save rating
    await rating.save();
    res.json(rating);
  } catch (err) {
    console.log(err);
  }
});

router.get("/", async (req, res) => {
  try {
    let rating = await Rating.find();
    res.json(rating);
  } catch (err) {
    console.log(err);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    // Find rating by id
    let rating = await Rating.findById(req.params.id);

    await rating.remove();
    res.json(rating);
  } catch (err) {
    console.log(err);
  }
});

router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    let rating = await Rating.findById(req.params.id);

    const data = {
      user_id: req.body.user_id || rating.user_id,
      rating_num: req.body.number || rating.rating_num,
    };
    rating = await Rating.findByIdAndUpdate(req.params.id, data, {
      new: true,
    });
    res.json(rating);
  } catch (err) {
    console.log(err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    // Find rating by id
    let rating = await Rating.findById(req.params.id);
    res.json(rating);
  } catch (err) {
    console.log(err);
  }
});
//coments

module.exports = router;
