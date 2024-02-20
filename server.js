const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const session = require("express-session");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

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

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/CRUD");
const db = mongoose.connection;

// Register endpoint for user registration
app.post("/register", async function (req, res) {
  try {
    // Extract username and password from the request body
    const username = req.body.username;
    const password = req.body.password;

    // Validate input
    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username and password are required" });
    }

    // Hash the password before storing it in the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a data object to insert into the database
    const data = {
      username: username,
      password: hashedPassword,
    };

    // Insert the data into the "details" collection in the database
    await db.collection("details").insertOne(data);

    // Respond with a success message
    res.json({ message: "Record inserted successfully" });
  } catch (error) {
    // Log and respond with an error message in case of an exception
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start the server on port 3000
app.listen(3000, function () {
  console.log("Server is running on port 3000");
});