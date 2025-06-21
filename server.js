const express = require("express");
const cors = require("cors");
const app = express();
const rideRoute = require("./routes/rideRoute");
const userRoute = require("./routes/userRoute");
const connectDB = require("./config/db");

connectDB();

const allowedOrigins = [
  "https://ride-along-frontend.vercel.app",
  "http://localhost:5173",
];
app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps, curl, etc.)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

app.use(express.json());

app.use("/public", express.static("public"));

app.use("/api/rides", rideRoute);
app.use("/api/user", userRoute);

app.get("/", (req, res) => {
  res.send("🚗 RideAlong backend is live!");
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
