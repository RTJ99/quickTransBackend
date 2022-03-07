const router = require("express").Router();
const cloudinary = require("../utils/cloudinary");
const upload = require("../utils/multer");
const Car = require("../models/car");

router.post("/", upload.single("image"), async (req, res) => {
  try {
    // Upload image to cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);

    // Create new car
    let car = new Car({
      plate: req.body.plate,
      picture: result.secure_url,
      cloudinary_id: result.public_id,
      make: req.body.make,
      capacity: req.body.capacity,
      summary: req.body.summary,
      driver: req.body.driver,
    });
    // Save car
    await car.save();
    res.json(car);
  } catch (err) {
    console.log(err);
  }
});

router.get("/", async (req, res) => {
  try {
    let car = await Car.find();
    res.json(car);
  } catch (err) {
    console.log(err);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    // Find car by id
    let car = await Car.findById(req.params.id);
    // Delete image from cloudinary
    await cloudinary.uploader.destroy(car.cloudinary_id);
    // Delete car from db
    await car.remove();
    res.json(car);
  } catch (err) {
    console.log(err);
  }
});

router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    let car = await Car.findById(req.params.id);
    // Delete image from cloudinary
    await cloudinary.uploader.destroy(car.cloudinary_id);
    // Upload image to cloudinary
    let result;
    if (req.file) {
      result = await cloudinary.uploader.upload(req.file.path);
    }
    const data = {
      plate: req.body.plate || car.name,
      picture: result?.secure_url || car.picture,
      cloudinary_id: result?.public_id || car.cloudinary_id,
      make: req.body.make || car.make,
      capacity: req.body.capacity || car.capacity,
      summary: req.body.summary || car.summary,
      pickup_points: req.body.pickup_points || car.pickup_points,
      driver: req.body.driver || car.driver,
    };
    car = await Car.findByIdAndUpdate(req.params.id, data, { new: true });
    res.json(car);
  } catch (err) {
    console.log(err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    // Find car by id
    let car = await Car.findById(req.params.id);
    res.json(car);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
