"use strict";
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();

// Allow requests from all origins
// app.use(cors({
//   origin: 'https://task-management-app-v2-ui.vercel.app' 
// }));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Middleware
app.use(bodyParser.json());

// Dynamic port binding
const path = require("path");
const dotenv = require("dotenv");
dotenv.config({
  path: path.join(__dirname, `/env/${process.env.NODE_ENV}.env`),
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

// Routes
app.use("/auth", require("./routes/auth"));
app.use("/tasks", require("./routes/tasks"));
app.use("/profile", require("./routes/profile"));

// Start server
const PORT = process.env.PORT || 7860;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
