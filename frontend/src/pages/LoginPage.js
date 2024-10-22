import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LoginPage.css";
import LoginImage from "../assets/login.png";
import Navbar from "../components/Navbar";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Email validation regex pattern
  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Clear previous errors
    setLoading(true);
  
    // Input validation
    if (!email || !password) {
      setErrorMessage("Email and password are required.");
      setLoading(false);
      return;
    }
  
    if (!isValidEmail(email)) {
      setErrorMessage("Please enter a valid email.");
      setLoading(false);
      return;
    }
  
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      // Check if the response is successful
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Login failed");
      }
  
      const data = await response.json(); // Parse the JSON response
  
      // Ensure the response contains the user _id
      if (data.user && data.user._id) {
        // Store user email and _id in localStorage
        localStorage.setItem('userEmail', data.user.email);
        localStorage.setItem('userId', data.user._id);
  
        
  
        // Navigate to the purchase page after successful login
        navigate("/purchase");
      } else {
        throw new Error("Invalid response from server");
      }
  
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage(error.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false); // Stop loading indicator
    }
  };
  

  return (
    <>
      <Navbar />
      <div className="login-container">
        <div className="login-form-container">
          <h2 className="login-title">Login</h2>
          {errorMessage && <div className="error-message" aria-live="assertive">{errorMessage}</div>}
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                disabled={loading} // Disable input while loading
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                disabled={loading} // Disable input while loading
              />
            </div>
            <button type="submit" className="login-button" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
          <p className="signup-link">
            Don't have an account? <a href="/register">Sign up</a>
          </p>
        </div>
        <div className="login-image-container">
          <img src={LoginImage} alt="Login Illustration" />
        </div>
      </div>
    </>
  );
};

export default Login;
