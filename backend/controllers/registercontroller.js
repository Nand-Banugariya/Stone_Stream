const express = require('express');
const multer = require('multer');// Ensure password is hashed
const User = require('../models/register'); // User model
const cloudinary = require('../cloud'); // Cloudinary configuration
const { CloudinaryStorage } = require('multer-storage-cloudinary');
//const { v4: uuidv4 } = require('uuid'); // Import uuid for session_id generation

// Setup Cloudinary storage for multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'user_photos', // Cloudinary folder for user photos
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});

const upload = multer({ storage: storage });

// Register User
const registerUser = async (req, res) => {
  const { name, email, password, mobileNo, shopName, address } = req.body;

  if (!name || !email || !password || !mobileNo || !shopName || !address) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password before saving the user
    

    // Check if an image is uploaded
    let photoUrl = null;
    if (req.file) {
      photoUrl = req.file.path; // Store the Cloudinary URL
    }

    // Generate a session_id using uuid
    //const sessionId = uuidv4();

    // Create new user
    const newUser = new User({
      name,
      email,
      password, // Store hashed password
      mobileNo,
      shopName,
      address,
      photo: photoUrl,
      session_id: sessionId, // Store the generated session_id
    });

    await newUser.save();

    res.status(201).json({
      message: 'User registered successfully',
      session_id: sessionId, // Optionally return session_id in the response
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  upload,
};
