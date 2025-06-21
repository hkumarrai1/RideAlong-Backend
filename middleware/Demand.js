const Ride = require("../models/Ride");

const calculateDemandFactor = async (currentLocation) => {
  try {
    const RADIUS = 5; // Define search radius in kilometers
    const THRESHOLD = 2; // If active rides exceed this, apply surge

    // Fetch ongoing rides within radius using Mongoose geospatial query
    const activeRides = await Ride.countDocuments({
      location: {
        $geoWithin: {
          $centerSphere: [
            [currentLocation.lon, currentLocation.lat],
            RADIUS / 6378.1,
          ],
        },
      },
      status: "available", // Only count currently available rides
    });

    // Apply surge if demand exceeds threshold
    return activeRides > THRESHOLD ? (activeRides - THRESHOLD) / THRESHOLD : 0;
  } catch (error) {
    return 0;
  }
};

module.exports = calculateDemandFactor;
