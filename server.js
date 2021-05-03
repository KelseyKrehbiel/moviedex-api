require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const MOVIEDEX = require("./movies-data-small.json");

console.log(process.env.API_TOKEN);

const app = express();

app.use(morgan("dev"));
app.use(helmet());
app.use(cors());

app.use(function validateBearerToken(req, res, next) {
  const apiToken = process.env.API_TOKEN;
  const authToken = req.get("Authorization");
  console.log("validate bearer token middleware");

  if (!authToken || authToken.split(" ")[1] !== apiToken) {
    return res.status(401).json({ error: "Unauthorized request" });
  }
  next();
});

function handleGetMovie(req, res) {
  let film_title = req.query.film_title;
  let genre = req.query.genre;
  let country = req.query.country;
  let avg_vote = req.query.avg_vote;
  let result = MOVIEDEX;

  if (film_title) {
    film_title = film_title.toLowerCase();
    result = result.filter((item) => item.film_title.toLowerCase().indexOf(film_title) >= 0);
  }
  if (genre) {
    genre = genre.toLowerCase();
    result = result.filter((item) => item.genre.toLowerCase().indexOf(genre) >= 0);
  }
  if (country) {
    country = country.toLowerCase();
    result = result.filter((item) => item.country.toLowerCase().indexOf(country) >= 0);
  }
  if (avg_vote) {
    avg_vote = parseInt(avg_vote);
    result = result.filter((item) => item.avg_vote >= avg_vote);
  }
  res.json(result);
}

app.get("/movie", handleGetMovie);

const PORT = 8000;

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
