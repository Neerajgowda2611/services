import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const Callback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const hasProcessed = useRef(false);

  useEffect(() => {
    if (hasProcessed.current) {
      return;
    }

    const handleCallback = async () => {
      hasProcessed.current = true;

      const urlParams = new URLSearchParams(window.location.search);
      const authCode = urlParams.get('code');

      if (!authCode) {
        setError('Authorization code not found');
        console.error('Authorization code not found!');
        return;
      }

      try {
        const response = await axios.post('https://servicesbk.cialabs.org/api/token', {
          code: authCode,
        });
       
        const { access_token } = response.data;
        
        if (access_token) {
          // Set the cookie
          Cookies.set('access_token', access_token, {
            expires: 7,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
          });
          
          // Simply redirect to Nginx - it will check for the cookie
          window.location.href = 'http://22.0.0.179';
        } else {
          throw new Error('No access token received from the backend');
        }
      } catch (error) {
        const errorMessage = error.response?.data?.detail || error.message;
        setError(`Authentication error: ${errorMessage}`);
        console.error('Authentication error:', error);
        
        if (error.response) {
          console.error('Error response:', {
            status: error.response.status,
            headers: error.response.headers,
            data: error.response.data,
          });
        }
      }
    };

    handleCallback();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-xl font-semibold mb-4">Processing OAuth Callback...</h1>
      {error ? (
        <div className="text-red-600 mb-4">{error}</div>
      ) : (
        <p>Please wait while we log you in...</p>
      )}
    </div>
  );
};

export default Callback;