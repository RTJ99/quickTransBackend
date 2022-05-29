const router = require('express').Router();
const cloudinary = require('../utils/cloudinary');
const upload = require('../utils/multer');
const OfferRide = require('../models/offerRide');
const multer = require('multer');
const { find } = require('../models/offerRide');
const User = require('../models/user');
const user = require('../models/user');
// const offerRide = require("../models/offerRide");

router.post('/book', async (req, res) => {
  let offerRide = await OfferRide.findById(req.body.rideId);
  if (offerRide.driver_id === req.body.userId) {
    return;
  }
  let seatsNeeded = req.body.seatsNeeded;
  let seatsTaken = offerRide.passengers.reduce(
    (acc, passenger) => acc + passenger.seats,
    0
  );

  if (
    Number(offerRide.seats) - (Number(seatsTaken) + Number(seatsNeeded)) <
    0
  ) {
    res.status(400).json({
      message: 'Seats are full',
      seatsLeft: Number(offerRide.seats) - Number(seatsTaken),
    });
    return;
  } else {
    if (
      offerRide.passengers.filter(
        (passenger) => passenger.id === req.body.userId
      ).length > 0
    ) {
      return res.status(400).json({
        message: 'You have already booked this ride',
      });
    } else {
      const ridesss = {
        id: offerRide.id,
        to: offerRide.drop_off_location,
        from: offerRide.pickup_point,
        status: 'pending',
      };
      console.log(req.body.userId, 'userrr id');
      const newUser = await user.findOneAndUpdate(
        { _id: req.body.userId },
        {
          $push: {
            booked_rides: ridesss,
          },
        }
      );

      offerRide.passengers.push({
        id: req.body.userId,
        name: newUser.name,
        picture: newUser.picture,
        seats: seatsNeeded,
        status: 'pending',
      });

      const newOfferRide = await offerRide.save();
      await newUser.save();
      res.json(newOfferRide);
    }
  }

  /*   let seatsTaken = offerRide.passengers.reduce(
    (acc, passenger) => acc + passenger.seats,
    0
  ); */

  /*  if (
    offerRide.passengersPending.filter(
      (passenger) => passenger.id === req.body.userId
    ).length > 0
  ) {
    return res.status(400).json({
      message: 'You have already booked this ride',
    });
  } */
  /*  if (seatsTaken + passengers > offerRide.seats) {
    res.status(400).json({ message: 'Seats are full' });
    return;
  }
  console.log(offerRide, 'seats'); */
});

router.post('/accept-ride', async (req, res) => {
  console.log('rrrrrrr');
  let rideId = req.body.id;
  let userId = req.body.userId;
  let stat = req.body.status;
  let offerRide = await OfferRide.findById(req.body.id);
  let Userz = await user.findById(req.body.passengerid);

  offerRide.passengers.forEach(async (passenger, index) => {
    if (passenger.id == req.body.passengerid) {
      passenger.status = stat;
      offerRide.passengers[index] = passenger;
      if (stat == 'accept') {
        offerRide.seats = offerRide.seats - passenger.seats;
      }
      if (stat == 'reject') {
        offerRide.passengers.splice(index, 1);
      }
      await offerRide.save();
      Userz.booked_rides.forEach(async (ride, index) => {
        if (ride.id == rideId) {
          ride.status = stat;
          Userz.booked_rides[index] = ride;
          await Userz.save();
        }
      });
    }
    res.json({
      status: 200,
      message: 'done',
    });
  });
  /*
  offerRide.passengers.push(passenger);

  offerRide.passengersPending = offerRide.passengersPending.filter(
    ({ id }) => id !== userId
  );

  await offerRide.save(); */
});
router.post('/depart', async (req, res) => {
  let rideId = req.body.id;
  let offerRide = await OfferRide.findById(req.body.id);
  offerRide.status = 'departed';
  await offerRide.save();
});

router.post('/unbook', async (req, res) => {
  let userId = req.body.userId;
  let rideId = req.body.id;
  let offerRide = await OfferRide.findById(req.body.id);

  let seatsTakenAccepted = offerRide.passengers.filter(
    (item) => item.id === userId && item.status === 'accept'
  );
  if (seatsTakenAccepted.length > 0) {
    const Taken = seatsTakenAccepted.seats;
    const newSeats = Number(offerRide.seats) + Number(Taken);
    console.log(Taken);

    offerRide.seats = newSeats;
    offerRide.passengers = offerRide.passengers.filter(
      ({ id }) => id !== userId
    );
    const user = await user.findById(req.body.userId);
    user.booked_rides.forEach(async (item, index) => {
      if (item.id == rideId) {
        user.booked_rides.splice(index, 1);
        await user.save();
      }
    });
    await offerRide.save();
    res.json(offerRide);
  } else {
    offerRide.passengers = offerRide.passengers.filter(
      ({ id }) => id !== userId
    );
    const userx = await user.findById(req.body.userId);
    userx.booked_rides.forEach(async (item, index) => {
      if (item.id == rideId) {
        userx.booked_rides.splice(index, 1);
        await userx.save();
      }
    });
    await offerRide.save();
    res.json(offerRide);
  }
});
router.post('/', upload.single('image'), async (req, res) => {
  const preferences = req.body.preferences.split(',');
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
      status: 'available',
      preferences: preferences,
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
      driver_id: req.body.driver_id,
    });

    console.log(req.body.driver_id, 'kkkkkkkk');
    // Save car
    const createdride = await offerRide.save();
    /*   let rideCreater = await user.findOneAndUpdate(
      { id: req.body.driver },
      { $push: { created_rides: createdride } }
    );

    const x = await rideCreater.save();

    console.log(x, 'Ride creater printed'); */

    res.json({
      data: createdride,
      status: 200,
    });
  } catch (err) {
    res.json({
      error: 'Something Went Wrong',
      status: 500,
    });
    console.log(err);
  }
});

// Create new offerRide

router.get('/', async (req, res) => {
  try {
    let offerRide = await OfferRide.find();
    res.json(offerRide);
  } catch (err) {
    console.log(err);
  }
});

router.get('/passengers', async (req, res) => {
  try {
    let offerRide = await OfferRide.findById(req.query.id);
    let accepted = offerRide.passengers.map(
      async ({ id }) => await User.findById(id)
    );
    let pending = offerRide.passengersPending.map(
      async ({ id }) => await User.findById(id)
    );
    console.log(accepted, pending);
    res.json({ accepted, pending });
  } catch (err) {
    console.log(err);
  }
});

router.delete('/:id', async (req, res) => {
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

router.put('/:id', upload.single('image'), async (req, res) => {
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

router.get('/search', async (req, res) => {
  let { pickup_point, drop_off_location } = req.query;
  console.log(pickup_point);
  console.log(drop_off_location);
  let data = await OfferRide.find({
    pickup_point: { $regex: pickup_point, $options: 'si' },
    drop_off_location: { $regex: drop_off_location, $options: 'si' },
    status: 'available',
  });
  console.log(data);
  res.send(data);
});
router.get('/rideby/:id', async (req, res) => {
  try {
    // Find offerRide by id
    let offerRide = await OfferRide.find({ driver_id: req.params.id });
    res.json(offerRide);
  } catch (err) {
    console.log(err);
  }
});
router.get('/getride/:id', async (req, res) => {
  try {
    console.log('fetching');
    // Find offerRide by id
    let offerRide = await OfferRide.find({ id: req.params.id });
    res.json(offerRide);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
