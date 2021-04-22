'use strict'

// Load Environ Variables from .env
require('dotenv').config();


// Application Dependencies
const express = require('express');
const cors = require('cors');
const notFound = require('./components/not-found');
const getWeatherHandler = require('./components/weather');
const getMoviesHandler = require('./components/movies');

// App setup
const app = express();
const PORT = process.env.PORT;
app.use(cors());


// Route Defs
app.get('/', (request, response) => {
  response.send('Welcome to the homepage');
});
app.get('/weather', getWeatherHandler);
app.get('/movies', getMoviesHandler);
app.use('*', notFound);

// Always listening
app.listen(PORT, () => {
  console.log(`listening on  PORT ${PORT}`)
});

