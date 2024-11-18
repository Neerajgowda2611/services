import React, { useState, useEffect } from "react";
import axios from "axios";
import {jwtDecode}from "jwt-decode"; // Use jwt-decode to decode the token

const CredentialsPage = ({ service }) => {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("");

  // Function to get cookie value by name
  function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([.$?*|{}()[]\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
  }

  // Function to fetch user details
  const fetchUserDetails = async () => {
    try {
      const accessToken = getCookie("access_token");
      if (!accessToken) {
        console.error("Access token not found in cookies.");
        return;
      }

      const decoded_token = jwtDecode(accessToken);  // Decode token to extract user details
      const user_id = decoded_token.id;

      // Fetch user details from backend API
      const response = await axios.get(`https://servicesbk.cialabs.org/api/user-details?user_id=${user_id}`, {
        // headers: { Authorization: `Bearer ${accessToken}` },
        withCredentials:true,
      });

      setUser(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  // Function to generate new access keys and secret
  const generateKeys = async () => {
    setStatus("Generating keys...");
    try {
      const accessToken = getCookie("access_token");
      if (!accessToken) {
        setStatus("No access token available.");
        return;
      }

      const decoded_token = jwtDecode(accessToken);
      const user_id = decoded_token.id;

      // Send request to generate keys
      const response = await axios.post(
        `https://servicesbk.cialabs.org/generate-keys?user_id=${user_id}`,
        {},
        // { headers: { Authorization: `Bearer ${accessToken}` } },
        {
          withCredentials:true,
        }
    );

      // Update the user state with generated keys
      setUser({ ...user, accessKey: response.data.accessKey, accessSecret: response.data.accessSecret });
      setStatus("Keys generated successfully.");
      fetchUserDetails();
    } catch (error) {
      setStatus("Failed to generate keys.");
      console.error("Error generating keys:", error);
    }
  };

  // UseEffect to fetch user details when the component mounts
  useEffect(() => {
    fetchUserDetails();
  }, []);

  if (!user) return <div>Loading...</div>;

  return (
    <div className="credentials-page">
      <h2>{service} Credentials</h2>
      <div className="credentials-table">
        <div className="credentials-row">
          <span className="credentials-label">User ID:</span>
          <span className="credentials-value">{user?.data.id}</span>
        </div>
        <div className="credentials-row">
          <span className="credentials-label">Email:</span>
          <span className="credentials-value">{user?.data.email}</span>
        </div>
        <div className="credentials-row">
          <span className="credentials-label">Name:</span>
          <span className="credentials-value">{user?.data.name}</span>
        </div>
        <div className="credentials-row">
          <span className="credentials-label">Created Time:</span>
          <span className="credentials-value">{user?.data.createdTime}</span>
        </div>
        <div className="credentials-row">
          <span className="credentials-label">Access Key:</span>
          <span className="credentials-value">{user?.data.accessKey || "N/A"}</span>
        </div>
        <div className="credentials-row">
          <span className="credentials-label">Access Secret:</span>
          <span className="credentials-value">{user?.data.accessSecret || "N/A"}</span>
        </div>
      </div>
      <button className="generate-btn" onClick={generateKeys}>
        Generate key and secret
      </button>
      <p>{status}</p>
    </div>
  );
};

export default CredentialsPage;
