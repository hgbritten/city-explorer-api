'use strict'

const superagent = require('superagent');
require('dotenv').config();

async function getMoviesHandler(request, response) {
  console.log('made it to movies');
  const cityName = request.query.cityName;

  const key = process.env.MOVIE_API_KEY;

  const url = `https://api.themoviedb.org/3/search/movie?query=${cityName}&api_key=${key}`
  const movieResponse = await superagent.get(url);

  const movieObject = JSON.parse(movieResponse.text);

  const movieArray = movieObject.results;

  const popMovies = movieArray.map(movie => new Movies(movie));

  response.send(popMovies);
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
