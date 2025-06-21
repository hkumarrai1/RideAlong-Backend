const axios = require("axios");

const getWeatherImpact = async (location) => {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&current_weather=true`;

    const response = await axios.get(url);
    const weatherData = response.data.current_weather;

    // Define pricing impact based on weather conditions
    let weatherFactor = 0;
    if (weatherData.weathercode >= 60) {
      // Weather code 60+ indicates rain/snow
      weatherFactor = 0.15; // Increase fare by 15%
    }

    return weatherFactor;
  } catch (error) {
    return 0; // No change in pricing if API fails
  }
};

module.exports = { getWeatherImpact };
