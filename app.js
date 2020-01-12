const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

const PORT = process.env.PORT || 3001;
const app = express();

/*=========  we should expect and allow a header with the content-type of 'Authorization' ============*/
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Headers", "Content-type,Authorization");
  next();
});

/*=========  enable CORS for development on localhost ============*/
app.use(cors());

/*=========  parse the requests/responses coming in and out of the server ============*/
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

/*========= routes ============*/
app.post("/post", (req, res) => {
  console.log("Got body:", req.body);
  const BASE_URL = "https://postman-echo.com/post";
  axios
    .post(BASE_URL, req.body)
    .then(data => data.data.json)
    .then(response => res.json(response));
});

app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});

module.exports = app;
