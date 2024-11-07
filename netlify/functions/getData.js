require("dotenv").config();
const axios = require("axios");

exports.handler = async function (event, context) {
  const headers = {
    "Access-Control-Allow-Origin": "*", // Allow all origins
    "Access-Control-Allow-Headers": "Content-Type",
  };
  const { latitude, longitude } = JSON.parse(event.body);
  const locationApiKey = process.env.API_KEY;
  const weatherApiKey = process.env.WEATHER_API_KEY;

  try {
    // Call LocationIQ API for reverse geocoding
    const locationResponse = await axios.get(
      `https://us1.locationiq.com/v1/reverse?key=${locationApiKey}&lat=${latitude}&lon=${longitude}&format=json`
    );
    const address = locationResponse.data;

    // Call WeatherAPI for the forecast
    const weatherResponse = await axios.get(
      `https://api.weatherapi.com/v1/forecast.json?key=${weatherApiKey}&q=${latitude},${longitude}&days=7&aqi=yes`
    );
    const weather = weatherResponse.data;

    // Return the address and weather data
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ address, weather }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
