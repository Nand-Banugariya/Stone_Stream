import React, { useState } from "react";
import "../styles/Register.css";
import { useNavigate } from "react-router-dom";
import RegisterImage from "../assets/register.png";
import Navbar from "../components/Navbar";
import axios from 'axios';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    shopName: "",
    address: "",
    mobileNo: "",
    email: "",
    password: "",
    photo: null,
  });

  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handlePhotoChange = (e) => {
    setFormData({
      ...formData,
      photo: e.target.files[0],
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // Create a FormData object
    const data = new FormData();
    data.append("name", formData.name);
    data.append("shopName", formData.shopName);
    data.append("address", formData.address);
    data.append("mobileNo", formData.mobileNo);
    data.append("email", formData.email);
    data.append("password", formData.password);
    if (formData.photo) {
      data.append("photo", formData.photo);
    }

    try {
      const response = await axios.post('http://localhost:5000/api/register', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.status === 201) {
        navigate("/login");
      }
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="register-container">
        <div className="register-image-container">
          <img src={RegisterImage} alt="Progress Illustration" />
        </div>
        <div className="register-form-container">
          <h2 className="register-title">Register</h2>
          <form onSubmit={handleRegister}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your name"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="shopName">Shop Name</label>
                <input
                  type="text"
                  id="shopName"
                  name="shopName"
                  value={formData.shopName}
                  onChange={handleInputChange}
                  placeholder="Enter your shop name"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="address">Address</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter your address"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="mobileNo">Mobile</label>
                <input
                  type="tel"
                  id="mobileNo"
                  name="mobileNo"
                  value={formData.mobileNo}
                  onChange={handleInputChange}
                  placeholder="Enter your mobile number"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="photo">Photo</label>
              <input
                type="file"
                id="photo"
                name="photo"
                onChange={handlePhotoChange}
                required
              />
            </div>

            <button type="submit" className="register-button">
              Register
            </button>
          </form>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <p className="login-link">
            Already have an account? <a href="/login">Login</a>
          </p>
        </div>
      </div>
    </>
  );
};

export default Register;
