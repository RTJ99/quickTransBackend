const router = require("express").Router();
const cloudinary = require("../utils/cloudinary");
const upload = require("../utils/multer");
const Tracking = require("../models/tracking");

router.post("/", upload.single("image"), async (req, res) => {
  try {
    // Create new tracking
    let tracking = new Tracking({
      car_id: req.body.car_id,

      user_id: req.body.user_id,
      longitude: req.body.longitude,
      latitude: req.body.latitude,
    });
    // Save tracking
    await tracking.save();
    res.json(tracking);
  } catch (err) {
    console.log(err);
  }
});

router.get("/", async (req, res) => {
  try {
    let tracking = await Tracking.find();
    res.json(tracking);
  } catch (err) {
    console.log(err);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    // Find tracking by id
    let tracking = await Tracking.findById(req.params.id);

    await tracking.remove();
    res.json(tracking);
  } catch (err) {
    console.log(err);
  }
});

router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    let tracking = await Tracking.findById(req.params.id);

    const data = {
      car_id: req.body.car_id || tracking.car_id,
      user_id: req.body.user_id || tracking.user_id,
      longitude: req.body.longitude || tracking.longitude,
      latitude: req.body.latitude || tracking.latitude,
    };
    tracking = await Tracking.findByIdAndUpdate(req.params.id, data, {
      new: true,
    });
    res.json(tracking);
  } catch (err) {
    console.log(err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    // Find tracking by id
    let tracking = await Tracking.findById(req.params.id);
    res.json(tracking);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
