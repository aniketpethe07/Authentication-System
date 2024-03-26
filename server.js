const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const connectDb = require("./dbConnection");
const session = require("express-session");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

dotenv.config();
connectDb();

// Configure session middleware
app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: false,
  })
);

//Middleware to parse incoming requests with JSON payloads
app.use(express.json());

// Register endpoint for user registration
app.use("/", require("./routes"));

// Start the server on port 3000
const port = process.env.PORT;
app.listen(port, function () {
  console.log(`Server is running on port ${port}`);
});
