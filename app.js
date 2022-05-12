const express = require("express");
const app = express();
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config({ path: "./config/config.env" });

app.use(express.json());
app.use(cors());

// Route
app.use("/user", require("./routes/user"));
// app.use('/login',require("./routes/login"));
app.use("/car", require("./routes/car"));
app.use("/offer-ride", require("./routes/offerRide"));
app.use("/search-ride", require("./routes/searchRide"));
app.use("tracking", require("./routes/tracking"));
app.use("/rating", require("./routes/rating"));
app.use("/seats", require("./routes/bookRide"));
app.use("/emergency-contact", require("./routes/emergencyContact"));

connectDB();

app.listen(8080, () => console.log("server started"));
