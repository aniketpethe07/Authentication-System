const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

//Middleware to parse incoming requests with JSON payloads
app.use(express.json());

// Start the server on port 3000
app.listen(3000, function () {
  console.log("Server is running on port 3000");
});