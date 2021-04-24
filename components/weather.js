'use strict'

const superagent = require('superagent');
// const notFound = require('./not-found');
require('dotenv').config();

const inMemoryDB = {};

async function getWeatherHandler(request, response) {
  const lat = request.query.lat;
  const lon = request.query.lon;
  try {

    const weatherAlreadyFound = inMemoryDB[lat + lon] !== undefined;

    if (weatherAlreadyFound && (Date.now() - inMemoryDB[lat + lon].timestamp < 3600000)) {
      const forecasts = inMemoryDB[lat + lon].forecasts;
      // console.log('success', inMemoryDB)
      response.status(200).send(forecasts);

    } else {

      const key = process.env.WEATHER_API_KEY;

      const url = `http://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&key=${key}`

      const weatherResponse = await superagent.get(url);

      const weatherObject = JSON.parse(weatherResponse.text);

      const weatherArray = weatherObject.data;

      const forecasts = weatherArray.map(day => new WeatherDay(day));
      inMemoryDB[lat + lon] = { forecasts, timestamp: Date.now() };
      // inMemoryDB[lat + lon] = {forecasts, dateCreated: is time stamp value older than ___? get new data and overwrite old memoryDB};\
      console.log('reset weather');
      response.status(200).send(forecasts);
    }
  } catch (err) {
    console.error('error', err);
    response.status(500).send('error', err);
  }
  // console.log(lat + lon);
}

class WeatherDay {
  constructor(day) {
    this.forecast = day.weather.description;
    this.time = day.datetime;
  }
}

module.exports = getWeatherHandler;
