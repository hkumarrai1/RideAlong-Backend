const axios = require("axios");

const getTrafficImpact = async (origin, destination) => {
  try {
    const apiKey = process.env.GRAPHHOPPER_API_KEY;
    if (!apiKey) throw new Error("GraphHopper API key not set in environment");
    const url = `https://graphhopper.com/api/1/route?point=${origin.lat},${origin.lon}&point=${destination.lat},${destination.lon}&vehicle=car&locale=en&key=${apiKey}`;

    const response = await axios.get(url);
    const routes = response.data.paths;

    // Extract estimated travel time
    const travelTime = routes[0].time / 1000;

    let trafficFactor = 0;
    if (travelTime > 2400) {
      trafficFactor = 0.18;
    } else if (travelTime > 1800) {
      trafficFactor = 0.1;
    } else if (travelTime > 1200) {
      trafficFactor = 0.06;
    } else if (travelTime > 900) {
      trafficFactor = 0.03;
    } else {
      trafficFactor = 0;
    }

    return trafficFactor;
  } catch (error) {
    return 0;
  }
};

module.exports = { getTrafficImpact };
