const router = require("express").Router();
let { Screen } = require("../models/seats");
let { isAvailable } = require("./../utils/checkSeatAvaibility");
let { getUnreservedSeats } = require("./../utils/unreservedSeats");
let { getSeatAvailableAtChoice } = require("./../utils/checkSeatOfChoice");

router.post("/offer", async (req, res) => {
  try {
    let screen = new Screen(req.body);
    await screen.save();
    res.send();
  } catch (e) {
    res.status(400).send(e);
    console.log(e);
  }
});

//API to reserve tickets for given seats in a given screen
router.post("/screens/:screen_name/reserve", async (req, res) => {
  try {
    let screenName = req.params.screen_name;
    let seats = req.body.seats;
    await isAvailable(screenName, seats);
    res.send("Reservation is successful");
  } catch (e) {
    res.status(400).send(e);
  }
});

/*
API to get the available seats for a given screen
And also
API to get information of available tickets at a given position
Same endpoint will be used for both. We will differentiate from queries.
*/
router.get("/screens/:screen_name/seats", async (req, res) => {
  try {
    let query = req.query;
    if (query.status && query.status === "unreserved") {
      //to get the available seats for a given screen
      let unreservedSeats = await getUnreservedSeats(req.params.screen_name);
      res.send(unreservedSeats);
    } else if (query.numSeats && query.choice) {
      //to get information of available tickets at a given position
      let seatOfChoice = await getSeatAvailableAtChoice(
        req.params.screen_name,
        query.numSeats,
        query.choice
      );
      res.send(seatOfChoice);
    } else {
      //return error 404 if any other endpoint is used.
      return res.status(404).send("Page not found");
    }
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;
