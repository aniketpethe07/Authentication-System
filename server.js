const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// Start the server on port 3000
app.listen(3000, function () {
  console.log("Server is running on port 3000");
});