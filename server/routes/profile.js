"use strict";
const express = require("express");
const profileController = require("../controllers/profileController");
const authMiddleware = require("../middleware/authMiddleware");
const { upload } = require("../middleware/multerMiddleware");

const router = express.Router();

// Profile routes
router.get("/me", authMiddleware, profileController.getProfile);
router.put(
  "/edit-profile",
  authMiddleware,
  upload.fields([{ name: "avatar", maxCount: 1 }]),
  profileController.updateProfile
);

module.exports = router;
