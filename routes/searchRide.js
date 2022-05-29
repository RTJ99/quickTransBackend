const router = require('express').Router();
const cloudinary = require('../utils/cloudinary');
const upload = require('../utils/multer');
const SearchRide = require('../models/offerRide');

router.post('/', upload.single('image'), async (req, res) => {
  try {
    // Create new searchRide
    let searchRide = new SearchRide({
      seats: req.body.seats,

      preferences: req.body.preferences,
      pickup_point: req.body.pickup_point,
      summary: req.body.summary,

      drop_off_location: req.body.drop_off_location,
      date: req.body.date,
    });
    // Save searchRide
    await searchRide.save();
    res.json(searchRide);
  } catch (err) {
    console.log(err);
  }
});

router.get('/', async (req, res) => {
  try {
    let searchRide = await SearchRide.find();
    res.json(searchRide);
  } catch (err) {
    console.log(err);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    // Find searchRide by id
    let searchRide = await SearchRide.findById(req.params.id);

    await searchRide.remove();
    res.json(searchRide);
  } catch (err) {
    console.log(err);
  }
});

router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    let searchRide = await SearchRide.findById(req.params.id);

    const data = {
      seats: req.body.seats || searchRide.seats,

      preferences: req.body.preferences || searchRide.preferences,
      pickup_point: req.body.pickup_point || searchRide.pickup_point,
      summary: req.body.summary || searchRide.summary,
      drop_off_location:
        req.body.drop_off_location || searchRide.drop_off_location,
      date: req.body.date || searchRide.date,
    };
    searchRide = await SearchRide.findByIdAndUpdate(req.params.id, data, {
      new: true,
    });
    res.json(searchRide);
  } catch (err) {
    console.log(err);
  }
});

router.get('/:id', async (req, res) => {
  try {
    // Find searchRide by id
    let searchRide = await SearchRide.findById(req.params.id);
    res.json(searchRide);
  } catch (err) {
    console.log(err);
  }
});
router.get('/search', async (req, res) => {
  console.log('kkkkkkkkkkkk');
  let { pickup_point, drop_off_location } = req.query;
  let data = await SearchRide.find({
    pickup_point: { $regex: req.query.pickup_point, $options: 'si' },
    drop_off_location: { $regex: req.query.drop_off_location, $options: 'si' },
  });
  /*  console.log('kkkkkkkkkkkk')
  let pickup_point = 'Neh';
  let drop_off_location = 'Kag'; */
  res.json(data);
});

module.exports = router;
