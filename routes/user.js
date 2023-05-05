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
    console.log("tirikusvika pano");

    const userExists = await User.findOne({ $or: [{ email }] });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }
    console.log("tirikusvika pano futi heyi");

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(otp, "otp");
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
    console.log(newUser, "newUser");
    // Send OTP to user's phone number
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    console.log(accountSid, authToken, "accountSid, authToken");
    const client = require("twilio")(accountSid, authToken);

    // console.log(client, "client");
    client.messages
      .create({
        body: "Your Gift Ride OTP is " + otp,
        from: "+13204138039",
        to: phone,
      })
      .then((message) => console.log(message.sid));

    res.status(200).json({ message: "OTP sent to phone number" });
  } catch (err) {
    if (err.name === "ValidationError") {
      console.error("Validation Error:", err.message);
      res.status(400).json({ message: "Validation Error", error: err.message });
    } else if (err.name === "CastError") {
      console.error("Cast Error:", err.message);
      res.status(400).json({ message: "Cast Error", error: err.message });
    } else {
      console.error("Server Error:", err.message);
      res.status(500).json({ message: "Server Error", error: err.message });
    }
  }
});
// OTP verification route
router.post("/verify-otp", async (req, res) => {
  try {
    const { phone, otp } = req.body;

    // Find user by phone number and OTP
    const user = await User.findOne({ phone, otp });
    if (!user) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Check if OTP has expired
    if (Date.now() > user.otpExpiration) {
      return res.status(400).json({ message: "OTP has expired" });
    }

    // Update user's verification status
    user.isVerified = true;
    await user.save();

    res.status(200).json({ message: "OTP verified successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body, "body");

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare passwords
    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, username: user.name },
      "mysecretkey",
      {
        expiresIn: "7h",
      }
    );

    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    console.error("Server Error:", err.message);
    res.status(500).json({ message: "Server Error", error: err.message });
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
  console.log(req.params.id, "id");
  try {
    // Find user by id
    let user = await User.findById(req.params.id);
    res.json(user);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
