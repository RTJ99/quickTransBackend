const router = require("express").Router();
const cloudinary = require("../utils/cloudinary");
const upload = require("../utils/multer");
const User = require("../models/user");

const twilio = require("twilio");
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

router.post("/register", async (req, res) => {
  try {
    const { name, email, phone, password, address } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ $or: [{ email }, { phone }] });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save user to database
    const newUser = new User({
      name,
      email,
      phone,
      password,
      address,
      otp,
      otpExpiration: Date.now() + 600000, // OTP expires after 10 minutes (600000 ms)
    });
    await newUser.save(); // Save user to MongoDB database

    // Send OTP to user's phone number
    const accountSid = "ACf0b4da57704e2d328913755956b05740";
    const authToken = "85176977becf35ff73465d50cc76b3de";
    const client = new twilio(accountSid, authToken);
    const message = await client.messages.create({
      body: `Your OTP for registration is: ${otp}`,
      from: "+13204138039",
      to: `+${phone}`,
    });
    console.log(message.sid);

    res.status(200).json({ message: "OTP sent to phone number" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
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

router.get("/:id", async (req, res) => {
  try {
    // Find user by id
    let user = await User.findById(req.params.id);
    res.json(user);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
