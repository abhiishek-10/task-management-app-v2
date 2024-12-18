"use strict";
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();

// Allow requests from all origins
app.use(cors());


// Middleware
app.use(bodyParser.json());

// Dynamic port binding
const path = require("path");
const dotenv = require("dotenv");
dotenv.config({
  // path: path.join(__dirname, `/env/${process.env.NODE_ENV}.env`),
  path: path.join(__dirname, `/.env`),
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on(
  "error",
  console.error.bind(console, "MongoDB connection error:")
);

app.get('/', (req, res) => {
        res.send('Express JS on Vercel')
    })

// Routes
app.use("/auth", require("./routes/auth"));
app.use("/tasks", require("./routes/tasks"));
app.use("/profile", require("./routes/profile"));

// Start server
const PORT = process.env.PORT || 7860;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
