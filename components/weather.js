'use strict'

const superagent = require('superagent');
require('dotenv').config();

async function getWeatherHandler(request, response) {

  const lat = request.query.lat;
  const lon = request.query.lon;

  const key = process.env.WEATHER_API_KEY;

  const url = `http://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&key=${key}`
  const weatherResponse = await superagent.get(url);

  const weatherObject = JSON.parse(weatherResponse.text);

  const weatherArray = weatherObject.data;

  const forecasts = weatherArray.map(day => new WeatherDay(day));

  response.send(forecasts);
}

class WeatherDay {
  constructor(day) {
    this.forecast = day.weather.description;
    this.time = day.datetime;
  }
}

module.exports = getWeatherHandler;