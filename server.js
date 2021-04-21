'use strict'

const express = require('express');
require('dotenv').config();
const weather = require('./data/weather.json');
const cors = require('cors');
const app = express();

app.use(cors());
const PORT = process.env.PORT || 3001;

app.get('/', (request, response) => {
  response.send('Welcome to the weather homepage');
});

app.get('/weather', (request, response) => {
  console.log(request.query);
  const weatherArray = weather.data.map(day => new Forecast(day));
  response.send(weatherArray);
});

function Forecast(day) {
  this.date = day.valid_date,
    this.description = day.weather.description
}


app.get('*', (request, response) => {
  response.status(404, 400, 500).send('Something went wrong.');
})

app.listen(PORT, () => console.log(`listening on ${PORT}`));

