// controllers/loginController.js
const User = require('../models/register');
const bcrypt = require('bcryptjs')

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    
    const users = await User.findOne({ email });
    if (!users) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

  
    const isMatch =  User.findOne({password});
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid  password' });
    }

    
    res.status(200).json({ message: 'Login successful', user: { email: users.email } });
  } catch (err) {
    console.error('Server error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};
