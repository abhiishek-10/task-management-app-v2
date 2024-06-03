"use strict";
const User = require("../models/User");
const { uploadOnCloud } = require("../utils/cloudinary");

exports.getProfile = async (req, res) => {
  try {
    // Find user based on userId
    const user = await User.findById(req.userId);
    // Return user profile
    console.log(user);
    res.json(user);
  } catch (err) {
    // Return err message
    res.status(500).json({ error: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    // Extract profile details from the request body
    const { firstName, lastName, bio } = req.body;
    console.log(req.files);
    const avatarLocalPath = req.files?.avatar[0]?.path;
    console.log(avatarLocalPath);
    const avatar = await uploadOnCloud(avatarLocalPath);
    console.log(avatar);

    // Update profile details in Users collection
    const updatedProfile = await User.findByIdAndUpdate(
      req.userId,
      { firstName, lastName, avatar: avatar.url, bio },
      { new: true }
    );

    // Return updated profile details
    res.json(updatedProfile);
  } catch (err) {
    // Return err message
    res.status(500).json({ error: err.message });
  }
};
