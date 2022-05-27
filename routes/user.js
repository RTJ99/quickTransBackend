const router = require("express").Router();
const cloudinary = require("../utils/cloudinary");
const upload = require("../utils/multer");
const User = require("../models/user");
const OfferRide = require("../models/offerRide");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

require("dotenv").config();

router.post("/", upload.single("image"), async (req, res) => {
  try {
    // Upload image to cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);

    // Create new user
    let user = new User({
      name: req.body.name,
      picture: result.secure_url,
      cloudinary_id: result.public_id,
      email: req.body.email,
      phone: req.body.phone,
      usuall_check_ins: req.body.usuall_check_ins,
      pickup_points: req.body.pickup_points,
      password: req.body.password,
      address: req.body.address,
    });
    console.log(req.body, "body");
    // Save user

    const userX = await user.save();
    console.log(userX, "user");
    res.send(userX);
  } catch (err) {
    console.log(err);
  }
});
router.post("/login", async (req, res, next) => {
  console.log("email", req.body);
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: req.body.username });
    console.log(user, "user");
    if (user) {
      // const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (password === user.password) {
        const token = jwt.sign(
          {
            email: user.email,
            name: user.name,
            phone: user.phone,
            ussuall_checkins: user.ussuall_check_ins,
            pickup_points: user.pickup_points,
            address: user.address,
            picture: user.picture,
            id: user._id.toString(),
          },
          "ryan"
        );

        console.log(token);
        return res.json({ token });
      }
      const error = new Error(`Password does not match email ${email}`);
      error.statusCode = 401;
      throw error;
    }
    const error = new Error(`This email ${email} does not exist`);
    error.statusCode = 401;
    throw error;
  } catch (err) {
    next(err);
  }
});

router.get("/", async (req, res) => {
  try {
    let user = await User.find();
    res.json(user);
  } catch (err) {
    console.log(err);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    // Find user by id
    let user = await User.findById(req.params.id);
    // Delete image from cloudinary
    await cloudinary.uploader.destroy(user.cloudinary_id);
    // Delete user from db
    await user.remove();
    res.json(user);
  } catch (err) {
    console.log(err);
  }
});

router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    let user = await User.findById(req.params.id);
    // Delete image from cloudinary
    await cloudinary.uploader.destroy(user.cloudinary_id);
    // Upload image to cloudinary
    let result;
    if (req.file) {
      result = await cloudinary.uploader.upload(req.file.path);
    }
    const data = {
      name: req.body.name || user.name,
      picture: result?.secure_url || user.picture,
      cloudinary_id: result?.public_id || user.cloudinary_id,
      email: req.body.email || user.email,
      phone: req.body.phone || user.phone,
      usuall_check_ins: req.body.usuall_check_ins || user.usuall_check_ins,
      pickup_points: req.body.pickup_points || user.pickup_points,
      password: req.body.pwd || user.pasword,
      address: req.body.address || user.address,
    };
    user = await User.findByIdAndUpdate(req.params.id, data, { new: true });
    res.json(user);
  } catch (err) {
    console.log(err);
  }
});
router.get("/last-ride/:id", async (req, res) => {
  let user = await User.findById(req.params.id);
  console.log(user, "user");
  user = user.toObject();
  let ride = await OfferRide.findById(user.rides[user.rides.length - 1]);
  res.json(ride);
});
router.get("/next-ride/:id", async (req, res) => {
  let user = await User.findById(req.params.id);
  let ride = await OfferRide.findById(user.nextRide);
  res.json({
    ride,
    status:
      ride.passengers.filter((p) => p.id === req.params.id) > 0
        ? "accepted"
        : ride.status === "available"
        ? "pending"
        : "rejected",
  });
});
router.get("/:id", async (req, res) => {
  try {
    // Find user by id
    let user = await User.findById(req.params.id);
    let ride = await OfferRide.findById(user.nextRide);

    // console.log(data);
    res.json(user);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
