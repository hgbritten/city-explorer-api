'use strict'

const superagent = require('superagent');
require('dotenv').config();

const inMemoryDB = {};

async function getMoviesHandler(request, response) {

  const cityName = request.query.cityName;

  try {

    const movieAlreadyFound = inMemoryDB[cityName] !== undefined
    if (movieAlreadyFound && (Date.now() - inMemoryDB[cityName].timestamp < 3600000)) {
      const popMovies = inMemoryDB[cityName].popMovies;
      // console.log('movie success', inMemoryDB)
      response.status(200).send(popMovies);

    } else {

      const key = process.env.MOVIE_API_KEY;

      const url = `https://api.themoviedb.org/3/search/movie?query=${cityName}&api_key=${key}`
      const movieResponse = await superagent.get(url);

      const movieObject = JSON.parse(movieResponse.text);

      const movieArray = movieObject.results;

      const popMovies = movieArray.map(movie => new Movies(movie));
      inMemoryDB[cityName] = { popMovies, timestamp: Date.now() };
      console.log('reset movies');
      response.send(popMovies);
    }
  } catch (err) {
    console.error('error', err);
    response.status(500).send('error', err);
  }
}

class Movies {
  constructor(movie) {
    this.title = movie.title;
    this.popularity = movie.popularity;
    this.overview = movie.overview;
    this.average_votes = movie.average_votes;
    this.total_votes = movie.total_votes;
    this.image = movie.poster_path;
    this.released_on = movie.released_on;
  }
}

module.exports = getMoviesHandler;
