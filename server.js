const express = require("express");
const cors = require("cors");
const app = express();
const rideRoute = require("./routes/rideRoute");
const userRoute = require("./routes/userRoute");
const connectDB = require("./config/db");

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/rides", rideRoute);
app.use("/api/user", userRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
