const express = require("express");
const router = express.Router();
const { getWeatherImpact } = require("../middleware/Weather");
const { getTrafficImpact } = require("../middleware/Traffic");
const calculateDemandFactor = require("../middleware/Demand");

router.post("/bookRide", async (req, res) => {
  try {
    let { currentLocation, destination } = req.body;
    // Parse lat/lon as numbers in case they are sent as strings
    currentLocation = {
      lat: Number(currentLocation?.lat),
      lon: Number(currentLocation?.lon),
    };
    destination = {
      lat: Number(destination?.lat),
      lon: Number(destination?.lon),
    };
    // Validate presence and type of coordinates
    if (
      !currentLocation ||
      !destination ||
      typeof currentLocation.lat !== "number" ||
      typeof currentLocation.lon !== "number" ||
      typeof destination.lat !== "number" ||
      typeof destination.lon !== "number" ||
      isNaN(currentLocation.lat) ||
      isNaN(currentLocation.lon) ||
      isNaN(destination.lat) ||
      isNaN(destination.lon)
    ) {
      return res.status(400).json({
        error:
          "Location and destination with valid numeric lat/lon are required",
      });
    }

    // Get weather and traffic factors
    const weatherFactor = await getWeatherImpact(currentLocation);
    const trafficFactor = await getTrafficImpact(currentLocation, destination);
    const demandFactor = await calculateDemandFactor(currentLocation);

    // Base fares
    const baseFare = 300;
    const finalFare =
      baseFare * (1 + weatherFactor + trafficFactor + demandFactor);

    const rideOptions = [
      { type: "Mini", avatar: "mini_car_url", fare: finalFare },
      { type: "Sedan", avatar: "sedan_car_url", fare: finalFare + 50 },
      { type: "SUV", avatar: "suv_car_url", fare: finalFare + 100 },
    ];

    return res.json({ options: rideOptions });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Temporary route to add a ride manually for testing/demo
router.post("/addRide", async (req, res) => {
  try {
    const { vehicleType, location, status, assignedDriver } = req.body;
    if (!vehicleType || !location || !location.coordinates) {
      return res.status(400).json({
        error: "vehicleType and location (with coordinates) are required",
      });
    }
    const Ride = require("../models/Ride");
    const newRide = new Ride({
      vehicleType,
      location,
      status: status || "available",
      assignedDriver: assignedDriver || undefined,
    });
    await newRide.save();
    res.status(201).json({ message: "Ride added successfully", ride: newRide });
  } catch (error) {
    // Return more detailed error info for debugging
    res.status(500).json({
      error: "Failed to add ride",
      details: error.message,
      validation: error.errors,
    });
  }
});

module.exports = router;
