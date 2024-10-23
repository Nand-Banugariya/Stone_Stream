const User = require('../models/register'); 
const jwt = require('jsonwebtoken');// Import the User model

// Login handler function
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare the provided password with the stored password (assuming plain-text for this example, but you should use hashing for security)
    if (password !== user.password) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ _id: user._id }, 'SecurityKey', { expiresIn: '1h' });

    // No session or localStorage on backend, but return the user email to frontend
    res.status(200).json({
      message: 'Login successful',
      user: {
        email: user.email,
        _id: user._id,
      },
      token, // Optional: return token if you're using JWT
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Export the loginUser function
module.exports = { loginUser };
