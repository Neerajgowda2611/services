// src/components/CredentialsPage.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // Import useParams hook
import '/home/silent/Desktop/services/frontend/src/App.css'; 
import axios from "axios";// Import shared CSS for styling

const CredentialsPage = () => {
  const { service } = useParams(); // Get the service name from the URL
  const [user, setUser ] = useState([]);


  const fetchUserDetails = async() => {
    try {
      const res = await axios.get("https://authtest.cialabs.org/api/get-user?userId=7b159c0d-a8c2-4ed1-a04e-68eb145ea938")
      setUser(res?.data?.data )
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchUserDetails()
  }, [])

  return (
    <div className="credentials-page">
      <h2>{service} Credentials</h2>
      <div className="credentials-table">
        <div className="credentials-row">
          <span className="credentials-label">user</span>
          <span className="credentials-value">{user?.id}</span>
        </div>
        <div className="credentials-row">
          <span className="credentials-label">Email:</span>
          <span className="credentials-value">{user?.email}</span>
        </div>
        <div className="credentials-row">
          <span className="credentials-label">Name:</span>
          <span className="credentials-value">{user?.name}</span>
        </div>
        <div className="credentials-row">
          <span className="credentials-label">Created Time:</span>
          <span className="credentials-value">{user?.createdTime}</span>
        </div>
        <div className="credentials-row">
          <span className="credentials-label">Access Key:</span>
          <span className="credentials-value">{user?.accessKey}</span>
        </div>
        <div className="credentials-row">
          <span className="credentials-label">Access Secret:</span>
          <span className="credentials-value">{user?.accessSecret}</span>
        </div>
      </div>
      <button className="generate-btn">Generate Key and Secret</button>
    </div>
  );
};

export default CredentialsPage;
