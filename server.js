'use strict'

// Load Environ Variables from .env
require('dotenv').config();
const superagent = require('superagent');

// Application Dependencies
const express = require('express');
const cors = require('cors');

// Our Dependencies
// const weather = require('./data/weather.json');
// const yelp = require('./modules/yelp.js');
// const movies = require('./modules/movies.js');

// App setup
const app = express();
const PORT = process.env.PORT;
app.use(cors());

// Route Defs
app.get('/', (request, response) => {
  response.send('Welcome to the homepage');
});

// app.get('/weather', (request, response) => {
//   try {
//     const weatherArray = weather.data.map(day => new Forecast(day));

//     response.status(200).send(weatherArray);
//   } catch (err) {
//     response.send(errorHandler(err));
//   }
// });

async function getWeatherHandler(request, response) {

  const lat = request.query.lat;
  const lon = request.query.lon;

  const key = process.env.WEATHER_API_KEY;

  const url = `http://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&key=${key}`
  const weatherResponse = await superagent.get(url);

  const weatherObject = JSON.parse(weatherResponse.text);

  const weatherArray = weatherObject.data;

  const forecasts = weatherArray.map(day => new Forecast(day));

  response.send(forecasts);
}



class Forecast {
  constructor(day) {
    this.forecast = day.weather.description;
    this.time = day.datetime;
  }
}

async function getMoviesHandler(request, response) {
  console.log('made it to movies');
  const cityName = request.query.cityName;

  const key = process.env.MOVIE_API_KEY;

  const url = `https://api.themoviedb.org/3/search/movie?query=${cityName}&api_key=${key}`
  const movieResponse = await superagent.get(url);

  const movieObject = JSON.parse(movieResponse.text);
  console.log(movieObject);
  const movieArray = movieObject.results;
  console.log(movieArray);

  const popMovies = movieArray.map(day => new Movies(day));

  response.send(popMovies);
}

class Movies {
  constructor(day) {
    this.title = day.title;
    this.popularity = day.popularity;
    this.overview = day.overview;
    this.average_votes = day.average_votes;
    this.total_votes = day.total_votes;
    this.image_url = day.image_url;
    this.released_on = day.released_on;
  }
}

app.get('/weather', getWeatherHandler);
app.get('/movies', getMoviesHandler);
// function errorHandler(err) {
//   console.log(err, 'there was an error');
// }

app.get('*', (request, response) => {
  response.status(404, 400, 500).send('Something went wrong.');
})

app.listen(PORT, () => console.log(`listening on  PORT ${PORT}`));

