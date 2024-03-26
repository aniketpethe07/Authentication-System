const express = require("express");
const bcrypt = require("bcrypt");
const User = require("./model");

const app = express();

app.use(express.json());

const register = async (req, res) => {
  try {
    // Extract username and password from the request body
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }

    // Check if the username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }

    // Hash the password before storing it in the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = await User.create({ username, password: hashedPassword });

    // Respond with a success message
    res.json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    // Log and respond with an error message in case of an exception
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


const login = async function (req, res) {
    try {
      // Find the user in the database based on the provided username
      const user = await User.findOne({ username : req.body.username});
  
      // Check if the user exists
      if (user) {
        // Compare the provided password with the hashed password in the database
        const result = await bcrypt.compare(req.body.password, user.password);
  
        if (result) {
          // Set the username in the session upon successful login
          req.session.username = req.body.username;
          res.send(`Welcome! ${req.session.username}`);
        } else {
          // Respond with an error if the password doesn't match
          res.status(400).json({ error: "Password doesn't match" });
        }
      } else { 
        // Respond with an error if the user doesn't exist
        res.status(400).json({ error: "User doesn't exist" });
      }
    } catch (error) {
      // Respond with an error message in case of an exception
      res.status(400).json({ error: error.message });
    }
  }
  const logout = (req, res) => {
    try {
      // Destroy the session
      req.session.destroy((err) => {
        if (err) {
          console.error("Error logging out:", err);
          res.status(500).json({ error: "Internal Server Error" });
        } else {
          // Respond with a success message
          res.json({ message: "Logout successful" });
        }
      });
    } catch (error) {
      // Respond with an error message in case of an exception
      console.error("Error logging out:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  
  module.exports = { register, login, logout };
  