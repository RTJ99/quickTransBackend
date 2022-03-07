const router = require("express").Router();
const cloudinary = require("../utils/cloudinary");
const upload = require("../utils/multer");
const EmergencyContact = require("../models/emergencyContact");

router.post("/", upload.single("image"), async (req, res) => {
  try {
    // Create new emergencyContact
    let emergencyContact = new EmergencyContact({
      name: req.body.name,

      number: req.body.number,
    });
    // Save emergencyContact
    await emergencyContact.save();
    res.json(emergencyContact);
  } catch (err) {
    console.log(err);
  }
});

router.get("/", async (req, res) => {
  try {
    let emergencyContact = await EmergencyContact.find();
    res.json(emergencyContact);
  } catch (err) {
    console.log(err);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    // Find emergencyContact by id
    let emergencyContact = await EmergencyContact.findById(req.params.id);

    await emergencyContact.remove();
    res.json(emergencyContact);
  } catch (err) {
    console.log(err);
  }
});

router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    let emergencyContact = await EmergencyContact.findById(req.params.id);

    const data = {
      name: req.body.name || emergencyContact.name,

      number: req.body.number || emergencyContact.number,
    };
    emergencyContact = await EmergencyContact.findByIdAndUpdate(
      req.params.id,
      data,
      {
        new: true,
      }
    );
    res.json(emergencyContact);
  } catch (err) {
    console.log(err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    // Find emergencyContact by id
    let emergencyContact = await EmergencyContact.findById(req.params.id);
    res.json(emergencyContact);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
