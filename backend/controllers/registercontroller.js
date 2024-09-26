const express = require('express');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const User = require('../models/register');
const { log } = require('console');

// Setup multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Ensure this folder exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  }
});

const upload = multer({ storage: storage });

// Register User
const registerUser = async (req, res) => {
  const { name, email, password, mobileNo, shopName, address } = req.body;
  const photo = req.file ? req.file.filename : null; // Save filename for photo

  if (!name || !email || !password || !mobileNo || !shopName || !address) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    console.log(hashedPassword);
    

    const newUser = new User({
      name,
      email,
      password:hashedPassword,
      mobileNo,
      shopName,
      address,
      photo, // Save filename in database
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error); // Log error details
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  upload // Export upload for use in route
};
