const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'dx6xroq8m', // Set your cloud name
  api_key: 491913968251946,       // Set your API key
  api_secret: 's0mAf-1WfRcqV0PlK_EFXCHkXus'  // Set your API secret
});

module.exports = cloudinary;
