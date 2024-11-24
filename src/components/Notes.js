import React, { useState, useEffect } from "react";
import axios from "axios";
import supabase from "./supabaseClient";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import eye icons

const NotesForm = () => {
  const [fullName, setFullName] = useState(""); // State for full name
  const [email, setEmail] = useState(""); // State for email
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // State for confirm password
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState(""); // State for save success message
  const [emailValid, setEmailValid] = useState(false); // State to check if email is valid

  // API URL for Abstract email validation service
  const API_URL = "https://emailvalidation.abstractapi.com/v1/";
  const API_KEY = "b0dcebff455d4ca7b90eebb9c08fe982"; // Replace with your Abstract API key

  // Debounce delay
  const DEBOUNCE_DELAY = 500; // 500 ms delay before verifying the email

  // This will store the timeout ID for the debounce
  const [debounceTimeout, setDebounceTimeout] = useState(null);

  // Function to check if email exists
  const checkEmailExists = async (email) => {
    try {
      const response = await axios.get(
        `${API_URL}?api_key=${API_KEY}&email=${email}`
      );

      if (response.data.deliverability === "DELIVERABLE") {
        setEmailValid(true);
        setError("");
      } else {
        setEmailValid(false);
        setError("Email does not exist or is invalid.");
      }
    } catch (error) {
      setEmailValid(false);
      setError("Error verifying email.");
    }
  };

  // Function to handle email input change
  const handleEmailChange = (e) => {
    const emailInput = e.target.value;
    setEmail(emailInput);

    // Clear the previous timeout if user types again
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    // Set the new timeout to check email after a delay
    const timeout = setTimeout(() => {
      if (emailInput) {
        checkEmailExists(emailInput); // Check if email exists
      } else {
        setEmailValid(false); // Reset email validity if input is empty
      }
    }, DEBOUNCE_DELAY);

    setDebounceTimeout(timeout); // Store the timeout ID
  };

  const saveNote = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSaveMessage(""); // Clear save message

    if (!emailValid) {
      setError("Please provide a valid email address.");
      setLoading(false);
      return;
    }

    if (password.length < 4) {
      setError("Password must be at least 4 characters long.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      setLoading(false);
      return;
    }

    // Save note to Supabase
    const { data, error } = await supabase
      .from("email")
      .insert([{ full_name: fullName, email, password, note }]); // Include email

    if (error) {
      setError("Error saving note: " + error.message);
    } else {
      setNote("");
      setFullName(""); // Clear full name
      setEmail(""); // Clear email
      setPassword("");
      setConfirmPassword(""); // Clear confirm password
      setSaveMessage(`Note saved successfully! Email: ${email}`); // Show success message
    }
    setLoading(false);
  };

  return (
    <div className="container mt-4 mt-5 ">
      <h2 className="text-center" style={{ fontVariantCaps: "unicase" }}>
        Lock Your Note
      </h2>

      <form onSubmit={saveNote} className="p-3 border rounded shadow my-4">
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Full Name"
            value={fullName}
            spellCheck="false"
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>

        {/* Email input with real-time validation */}
        <div className="mb-3">
          <input
            type="email"
            className="form-control"
            placeholder="Email"
            value={email}
            onChange={handleEmailChange}
            required
          />
        </div>

        {/* Display Email Domains as Buttons */}
        <div className="mb-3">
          <div className="d-flex flex-wrap gap-2">
            {[
              "gmail.com",
              "yahoo.com",
              "outlook.com",
              "hotmail.com",
            ].map((domain, index) => (
              <button
                key={index}
                type="button"
                className="btn btn-sm  btn-secondary"
                style={{ backgroundColor: "#d3d3d3" }} // Light grey button
                onClick={() => {
                  const usernamePart = email.split("@")[0]; // Extract the part before '@'
                  setEmail(`${usernamePart}@${domain}`); // Update the email with selected domain
                }}
              >
                @{domain}
              </button>
            ))}
          </div>
        </div>

        {/* Display email validation error */}
        {error && <p className="text-danger">{error}</p>}

        {/* Password fields */}
        <div className="mb-3" style={{ position: "relative" }}>
          <input
            type={showPassword ? "text" : "password"} // Toggle password visibility
            className="form-control"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              cursor: "pointer",
            }}
          >
            {showPassword ? <FaEye /> : <FaEyeSlash />}
          </span>
        </div>
        <div className="mb-3" style={{ position: "relative" }}>
          <input
            type={showPassword ? "text" : "password"} // Toggle confirm password visibility
            className="form-control"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              cursor: "pointer",
            }}
          >
            {showPassword ? <FaEye /> : <FaEyeSlash />}
          </span>
        </div>

        {/* Note input */}
        <div className="mb-3">
          <textarea
            className="form-control"
            placeholder="Your note here..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            required
            style={{ height: "200px" }}
          />
        </div>

        {/* Submit button */}
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? (
            <div className="spinner-border text-light" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          ) : (
            "Lock info"
          )}
        </button>
      </form>

      {/* Display success message */}
      {saveMessage && <p className="text-success mt-3">{saveMessage}</p>}
    </div>
  );
};

export default NotesForm;
