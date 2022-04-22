const router = require("express").Router();
const cloudinary = require("../utils/cloudinary");
const upload = require("../utils/multer");
const OfferRide = require("../models/offerRide");
const multer = require("multer");
const { find } = require("../models/offerRide");
// const offerRide = require("../models/offerRide");

router.post("/book", async (req, res) => {
  let offerRide = await OfferRide.findById(req.body.id);
  console.log(offerRide, "seats");
  if (offerRide.seats - 1 < 0) {
    res.status(400).json({ message: "Seats are full" });
    return;
  }
  offerRide.status = offerRide.seats - 1 === 0 ? "unavailable" : "available";
  offerRide.seats = offerRide.seats - 1;

  offerRide.passengers.push(req.body.passenger);
  await offerRide.save();
  res.json(offerRide);
});
router.post("/unbook", async (req, res) => {
  let offerRide = await OfferRide.findById(req.body.id);

  offerRide.seats = offerRide.seats + 1;
  offerRide.passengers = offerRide.passengers.filter(
    (id) => id !== req.body.passenger
  );
  offerRide.passengers.push(req.body.passenger);
  await offerRide.save();
  res.json(offerRide);
});
router.post("/", upload.single("image"), async (req, res) => {
  console.log("body", req.body);
  try {
    // Upload image to cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);

    let offerRide = new OfferRide({
      picture: result.secure_url,
      cloudinary_id: result.public_id,
      capacity: req.body.capacity,
      seats: req.body.seats,
      plate: req.body.plate,
      make: req.body.make,
      summary: req.body.summary,
      driver: req.body.driver,
      status: "available",
      preferences: req.body.preferences,
      pickup_point: req.body.pickup_point,
      summary: req.body.summary,
      car: req.body.car,
      drop_off_location: req.body.drop_off_location,
      pickupLat: req.body.pickupLat,
      dropOffLat: req.body.dropOffLat,
      pickupLng: req.body.pickupLng,
      dropOffLng: req.body.dropOffLng,
      date: req.body.date,
      amount: req.body.amount,
      driver_pic: req.body.driver_pic,
    });

    // Save car
    await offerRide.save();
    res.json(offerRide);
  } catch (err) {
    console.log(err);
  }
});

// Create new offerRide

router.get("/", async (req, res) => {
  try {
    let offerRide = await OfferRide.find();
    res.json(offerRide);
  } catch (err) {
    console.log(err);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    // Find offerRide by id
    let offerRide = await OfferRide.findById(req.params.id);
    // Delete image from cloudinary
    await cloudinary.uploader.destroy(offerRide.cloudinary_id);
    // Delete offerRide from db
    await offerRide.remove();
    res.json(offerRide);
  } catch (err) {
    console.log(err);
  }
});

router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    let offerRide = await OfferRide.findById(req.params.id);
    // Delete image from cloudinary
    await cloudinary.uploader.destroy(offerRide.cloudinary_id);
    // Upload image to cloudinary
    let result;
    if (req.file) {
      result = await cloudinary.uploader.upload(req.file.path);
    }
    const data = {
      plate: req.body.plate,

      make: req.body.make,
      capacity: req.body.capacity,

      driver: req.body.driver,
      seats: req.body.seats || offerRide.seats,
      picture: result?.secure_url || offerRide.picture,
      cloudinary_id: result?.public_id || offerRide.cloudinary_id,
      preferences: req.body.preferences || offerRide.preferences,
      pickup_points: req.body.pickup_points || offerRide.pickup_points,
      summary: req.body.summary || offerRide.summary,
      car: req.body.car || offerRide.car,
      date: req.body.date || offerRide.date,
      drop_off_location:
        req.body.drop_off_location || offerRide.drop_off_location,
    };
    offerRide = await OfferRide.findByIdAndUpdate(req.params.id, data, {
      new: true,
    });
    res.json(offerRide);
  } catch (err) {
    console.log(err);
  }
});

router.get("/search", async (req, res) => {
  let { pickup_point, drop_off_location } = req.query;
  let data = await OfferRide.find({
    pickup_point,
    drop_off_location,
    status: "available",
  });
  res.send(data);
});
router.get("/:id", async (req, res) => {
  try {
    // Find offerRide by id
    let offerRide = await OfferRide.findById(req.params.id);
    res.json(offerRide);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
