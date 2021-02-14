const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

//Server setup
const app = express();
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on Port: ${PORT}`));

//Connecting to MongoDB
mongoose.connect(
  process.env.MONGODB,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) return console.error(err);
    console.log("Connected to MongoDB!");
  }
);
