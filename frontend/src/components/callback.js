// import React, { useEffect } from 'react';
// import axios from 'axios';
// import Cookies from 'js-cookie';
// import { useNavigate } from 'react-router-dom'; // Updated to useNavigate

// const Callback = () => {
//   const navigate = useNavigate(); // Updated to useNavigate

//   useEffect(() => {
//     // Step 1: Extract the authorization code from the URL
//     const urlParams = new URLSearchParams(window.location.search);
//     const authCode = urlParams.get('code');

//     if (!authCode) {
//       // If no code is found, redirect to the login page or handle error
//       console.error('Authorization code not found!');
//       return;
//     }

//     // Step 2: Send the authorization code to Casdoor to get the access token
//     const client_id = '931cbff5298aef218fd0';
//     const client_secret = '31f07306354c22c3a4782e1e5057e0545e54abc8';
//     const redirect_uri = 'http://22.0.0.117:3000/callback';  // your callback URL

//     const tokenRequestData = {
//       client_id,
//       client_secret,
//       code: authCode,
//       redirect_uri,
//       grant_type: 'authorization_code',
//     };

//     axios.post('https://authtest.cialabs.org/oauth2/token', new URLSearchParams(tokenRequestData))
//       .then((response) => {
//         const { access_token } = response.data;

//         if (access_token) {
//           // Step 3: Store the access token in a cookie
//           Cookies.set('access_token', access_token, { expires: 7, path: '' });

//           // Redirect the user to the home page or wherever they should go after login
//           navigate('/'); // Updated to use navigate
//         } else {
//           console.error('No access token received!');
//         }
//       })
//       .catch((error) => {
//         console.error('Error exchanging authorization code for token:', error);
//       });
//   }, [navigate]);

//   return (
//     <div>
//       <h1>Processing OAuth Callback...</h1>
//       <p>Please wait while we log you in...</p>
//     </div>
//   );
// };

// export default Callback;
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const Callback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Extract the authorization code from the URL
        const urlParams = new URLSearchParams(window.location.search);
        const authCode = urlParams.get('code');

        if (!authCode) {
          setError('Authorization code not found');
          console.error('Authorization code not found!');
          setTimeout(() => navigate('/login'), 3000);
          return;
        }

        console.log('Sending request to backend with code:', authCode);

        // Configure axios for the request
        const axiosConfig = {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        };

        // First, check if the backend is healthy
        await axios.get('http://22.0.0.117:8000/health', axiosConfig);

        // Send the code to FastAPI backend
        const response = await axios.post(
          'http://22.0.0.117:8000/api/token',
          { code: authCode },
          axiosConfig
        );

        console.log('Received response:', response.data);

        const { access_token } = response.data;

        if (access_token) {
          // Store the token securely
          Cookies.set('access_token', access_token, {
            expires: 7,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',  // Changed to 'lax' for development
            path: '/'
          });

          // Redirect to home page
          navigate('/');
        } else {
          throw new Error('No access token received');
        }

      } catch (error) {
        const errorMessage = error.response?.data?.detail || error.message;
        setError(`Authentication error: ${errorMessage}`);
        console.error('Authentication error:', error);
        
        if (error.response) {
          console.error('Error response:', {
            status: error.response.status,
            headers: error.response.headers,
            data: error.response.data
          });
        }
        
        setTimeout(() => navigate('/'), 3000);
      }
    };

    handleCallback();
  }, [navigate]);

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


// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import Cookies from 'js-cookie';
// import { useNavigate } from 'react-router-dom';

// const Callback = () => {
//   const navigate = useNavigate();
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const handleCallback = async () => {
//       try {
//         // Extract the authorization code from the URL
//         const urlParams = new URLSearchParams(window.location.search);
//         const authCode = urlParams.get('code');

//         if (!authCode) {
//           setError('Authorization code not found');
//           console.error('Authorization code not found!');
//           setTimeout(() => navigate('/login'), 3000);
//           return;
//         }

//         console.log('Sending request to backend with code:', authCode);

//         // Configure axios for the request
//         const axiosConfig = {
//           withCredentials: true,  // This is important to send/receive cookies
//           headers: {
//             'Content-Type': 'application/json',
//             'Accept': 'application/json',
//           },
//         };

//         // Send the code to FastAPI backend to exchange for a token
//         const response = await axios.post(
//           'http://22.0.0.117:8000/api/token',
//           { code: authCode },
//           axiosConfig
//         );

//         console.log('Received response:', response.data);

//         // Check if the token was set in the response headers or cookies
//         if (response.status === 200) {
//           // Token is now securely stored in cookies by FastAPI backend
//           console.log('Token stored in cookies');

//           // Redirect to the home page
//           navigate('/');
//         } else {
//           throw new Error('Failed to authenticate user');
//         }

//       } catch (error) {
//         const errorMessage = error.response?.data?.detail || error.message;
//         setError(`Authentication error: ${errorMessage}`);
//         console.error('Authentication error:', error);
        
//         if (error.response) {
//           console.error('Error response:', {
//             status: error.response.status,
//             headers: error.response.headers,
//             data: error.response.data,
//           });
//         }

//         setTimeout(() => navigate('/'), 3000);
//       }
//     };

//     handleCallback();
//   }, [navigate]);

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen">
//       <h1 className="text-xl font-semibold mb-4">Processing OAuth Callback...</h1>
//       {error ? (
//         <div className="text-red-600 mb-4">{error}</div>
//       ) : (
//         <p>Please wait while we log you in...</p>
//       )}
//     </div>
//   );
// };

// export default Callback;
