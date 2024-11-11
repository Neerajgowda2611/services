// // src/components/CredentialsPage.js
// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom'; // Import useParams hook
// import '/home/silent/Desktop/services/frontend/src/App.css'; 
// import axios from "axios";// Import shared CSS for styling

// const CredentialsPage = () => {
//   const { service } = useParams(); // Get the service name from the URL
//   const [user, setUser ] = useState([]);


//   const fetchUserDetails = async() => {
//     try {
//       const res = await axios.get("https://authtest.cialabs.org/api/get-user?userId=7b159c0d-a8c2-4ed1-a04e-68eb145ea938")
//       setUser(res?.data?.data )
//     } catch (error) {
//       console.log(error)
//     }
//   }

//   useEffect(() => {
//     fetchUserDetails()
//   }, [])

//   return (
//     <div className="credentials-page">
//       <h2>{service} Credentials</h2>
//       <div className="credentials-table">
//         <div className="credentials-row">
//           <span className="credentials-label">user</span>
//           <span className="credentials-value">{user?.id}</span>
//         </div>
//         <div className="credentials-row">
//           <span className="credentials-label">Email:</span>
//           <span className="credentials-value">{user?.email}</span>
//         </div>
//         <div className="credentials-row">
//           <span className="credentials-label">Name:</span>
//           <span className="credentials-value">{user?.name}</span>
//         </div>
//         <div className="credentials-row">
//           <span className="credentials-label">Created Time:</span>
//           <span className="credentials-value">{user?.createdTime}</span>
//         </div>
//         <div className="credentials-row">
//           <span className="credentials-label">Access Key:</span>
//           <span className="credentials-value">{user?.accessKey}</span>
//         </div>
//         <div className="credentials-row">
//           <span className="credentials-label">Access Secret:</span>
//           <span className="credentials-value">{user?.accessSecret}</span>
//         </div>
//       </div>
//       <button className="generate-btn">Generate key and secret</button>
//     </div>
//   );
// };

// export default CredentialsPage;


////////////////////////////////////////////////////////////////////////////////////////////

// // src/components/CredentialsPage.js
// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import '/home/silent/Desktop/services/frontend/src/App.css'; 
// import axios from "axios";

// const CredentialsPage = () => {
//   const { service } = useParams();
//   const [user, setUser] = useState({});
//   const [status, setStatus] = useState("");

//   const accessToken = "token";
  
//   const fetchUserDetails = async () => {
//     try {
//       // Decode token to extract owner and name
//       const { owner, name } = decodeToken(accessToken);
      
//       // Fetch user data based on decoded owner and name
//       const res = await axios.get(`https://authtest.cialabs.org/api/get-user?id=${owner}/${name}`);
//       if (res?.data?.data) {
//         setUser(res.data.data);
//       } else {
//         setStatus("Failed to fetch user details.");
//       }
//     } catch (error) {
//       console.error("Error fetching user details:", error);
//       setStatus("Error fetching user details.");
//     }
//   };

//   const decodeToken = (token) => {
//     try {
//       const base64Url = token.split('.')[1];
//       const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
//       const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
//         return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
//       }).join(''));
//       return JSON.parse(jsonPayload);
//     } catch (error) {
//       console.error("Error decoding token:", error);
//       return {}; // Return empty object if decoding fails
//     }
//   };

//   const generateKeys = async () => {
//     try {
//       const response = await axios.post("https://authtest.cialabs.org/api/add-user-keys", user, {
//         headers: {
//           "Content-Type": "application/json"
//         },
//         withCredentials: true
//       });

//       if (response.data.status === "ok") {
//         setStatus("API keys generated and updated successfully!");
//         // Fetch updated user details after key generation
//         fetchUserDetails();
//       } else {
//         setStatus("Failed to update API keys.");
//       }
//     } catch (error) {
//       console.error("Error generating keys:", error);
//       setStatus("Error generating keys.");
//     }
//   };

//   useEffect(() => {
//     fetchUserDetails(); // This will fetch user data when the component mounts
//   }, []); // Empty dependency array ensures this runs only once

//   return (
//     <div className="credentials-page">
//       <h2>{service} Credentials</h2>
//       <div className="credentials-table">
//         <div className="credentials-row">
//           <span className="credentials-label">User ID:</span>
//           <span className="credentials-value">{user?.id}</span>
//         </div>
//         <div className="credentials-row">
//           <span className="credentials-label">Email:</span>
//           <span className="credentials-value">{user?.email}</span>
//         </div>
//         <div className="credentials-row">
//           <span className="credentials-label">Name:</span>
//           <span className="credentials-value">{user?.name}</span>
//         </div>
//         <div className="credentials-row">
//           <span className="credentials-label">Created Time:</span>
//           <span className="credentials-value">{user?.createdTime}</span>
//         </div>
//         <div className="credentials-row">
//           <span className="credentials-label">Access Key:</span>
//           <span className="credentials-value">{user?.accessKey}</span>
//         </div>
//         <div className="credentials-row">
//           <span className="credentials-label">Access Secret:</span>
//           <span className="credentials-value">{user?.accessSecret}</span>
//         </div>
//       </div>
//       <button className="generate-btn" onClick={generateKeys}>Generate key and secret</button>
//       <p>{status}</p>
//     </div>
//   );
// };

// export default CredentialsPage;


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////


import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '/home/silent/Desktop/services/frontend/src/App.css'; 
import axios from "axios";

const CredentialsPage = () => {
  const { service } = useParams();
  const [user, setUser] = useState({});
  const [status, setStatus] = useState("");

  // Replace "token" with the actual access token
  const accessToken = "eyJhbGciOiJSUzI1NiIsImtpZCI6ImNlcnQtYnVpbHQtaW4iLCJ0eXAiOiJKV1QifQ.eyJvd25lciI6ImdyZWV0IiwibmFtZSI6ImNhdCIsImNyZWF0ZWRUaW1lIjoiMjAyNC0xMS0wOVQxMjo1OToxOCswNTozMCIsInVwZGF0ZWRUaW1lIjoiMjAyNC0xMS0xMVQwNzoxNzowMFoiLCJkZWxldGVkVGltZSI6IiIsImlkIjoiN2IxNTljMGQtYThjMi00ZWQxLWEwNGUtNjhlYjE0NWVhOTM4IiwidHlwZSI6Im5vcm1hbC11c2VyIiwicGFzc3dvcmQiOiIiLCJwYXNzd29yZFNhbHQiOiIiLCJwYXNzd29yZFR5cGUiOiJwbGFpbiIsImRpc3BsYXlOYW1lIjoiYmF0dCIsImZpcnN0TmFtZSI6IiIsImxhc3ROYW1lIjoiIiwiYXZhdGFyIjoiaHR0cHM6Ly9jZG4uY2FzYmluLm9yZy9pbWcvY2FzYmluLnN2ZyIsImF2YXRhclR5cGUiOiIiLCJwZXJtYW5lbnRBdmF0YXIiOiIiLCJlbWFpbCI6IjFjdzd0d0BleGFtcGxlLmNvbSIsImVtYWlsVmVyaWZpZWQiOmZhbHNlLCJwaG9uZSI6Ijk2MTU3MzY3MDQ5IiwiY291bnRyeUNvZGUiOiJVUyIsInJlZ2lvbiI6IiIsImxvY2F0aW9uIjoiIiwiYWRkcmVzcyI6W10sImFmZmlsaWF0aW9uIjoiRXhhbXBsZSBJbmMuIiwidGl0bGUiOiIiLCJpZENhcmRUeXBlIjoiIiwiaWRDYXJkIjoiIiwiaG9tZXBhZ2UiOiIiLCJiaW8iOiIiLCJsYW5ndWFnZSI6IiIsImdlbmRlciI6IiIsImJpcnRoZGF5IjoiIiwiZWR1Y2F0aW9uIjoiIiwic2NvcmUiOjIwMDAsImthcm1hIjowLCJyYW5raW5nIjo1LCJpc0RlZmF1bHRBdmF0YXIiOmZhbHNlLCJpc09ubGluZSI6ZmFsc2UsImlzQWRtaW4iOnRydWUsImlzRm9yYmlkZGVuIjpmYWxzZSwiaXNEZWxldGVkIjpmYWxzZSwic2lnbnVwQXBwbGljYXRpb24iOiJzdHJpbmciLCJoYXNoIjoiIiwicHJlSGFzaCI6IiIsImFjY2Vzc0tleSI6ImYxMGE0ZGM5LWEzZDgtNDA0Mi1hNmYxLTZkNTZmYzZiZDU4NCIsImFjY2Vzc1NlY3JldCI6IjYyM2RkYmVmLTIwMmYtNGY5NS05MDMxLTMwNGM0ZmM2NjhmOCIsImdpdGh1YiI6IiIsImdvb2dsZSI6IiIsInFxIjoiIiwid2VjaGF0IjoiIiwiZmFjZWJvb2siOiIiLCJkaW5ndGFsayI6IiIsIndlaWJvIjoiIiwiZ2l0ZWUiOiIiLCJsaW5rZWRpbiI6IiIsIndlY29tIjoiIiwibGFyayI6IiIsImdpdGxhYiI6IiIsImNyZWF0ZWRJcCI6IiIsImxhc3RTaWduaW5UaW1lIjoiIiwibGFzdFNpZ25pbklwIjoiIiwicHJlZmVycmVkTWZhVHlwZSI6IiIsInJlY292ZXJ5Q29kZXMiOm51bGwsInRvdHBTZWNyZXQiOiIiLCJtZmFQaG9uZUVuYWJsZWQiOmZhbHNlLCJtZmFFbWFpbEVuYWJsZWQiOmZhbHNlLCJsZGFwIjoiIiwicHJvcGVydGllcyI6e30sInJvbGVzIjpbXSwicGVybWlzc2lvbnMiOltdLCJncm91cHMiOltdLCJsYXN0U2lnbmluV3JvbmdUaW1lIjoiIiwic2lnbmluV3JvbmdUaW1lcyI6MCwibWFuYWdlZEFjY291bnRzIjpudWxsLCJ0b2tlblR5cGUiOiJhY2Nlc3MtdG9rZW4iLCJ0YWciOiJzdGFmZiIsInNjb3BlIjoicHJvZmlsZSIsImlzcyI6Imh0dHBzOi8vYXV0aHRlc3QuY2lhbGFicy5vcmciLCJzdWIiOiI3YjE1OWMwZC1hOGMyLTRlZDEtYTA0ZS02OGViMTQ1ZWE5MzgiLCJhdWQiOlsiMjEwYzk5N2Q2Y2I2NzgxMjAzZjMiXSwiZXhwIjoxNzMxOTIxNDkxLCJuYmYiOjE3MzEzMTY2OTEsImlhdCI6MTczMTMxNjY5MSwianRpIjoiYWRtaW4vNWYxZDVjYTUtNzFlZi00MThkLThjMmUtMzYxNjVlNDhlNjZiIn0.jb34vTfZR0OZveDp4T0cBKGYDwMAS8offotFG1iVV58cw0EoomryNokXX27bF1PPPGQV6ijcQTvEz4Us7G0t5rB_VwM2d3eeD3PAdndyokRsCCVWVVB7AVE3fXRk7A9jw9mfYRC3uwxNEZCeF1zD8BT6C1p90yBFsb5idCR2aj2FnN5oQUsGFGQSUnMbIL5Gxu9ur2LTFHgAwvpMBDz3JltV_v6aXr9ebyh11drPY7B3utvFvoiL1zutTlcXEGTy8fcZaSOfpc3tfU8CTqGLxJeuYKEOBac67mxh8PYU3JLs45VaDnbW5TtxaYzWDf5gkkytfDbtlfmc6L79OcsRZAXXF9yHBkuGxVMVuNSYUhaTvAk0cl91W3nExfgb-1rNxLJq3ndwS5Pmt5bE64FWjv5luSTTUR7e722WGUG3sg5cBaAmzvwzlE4aYZUP9KhJJMywkOujKYkNU80qPEG-cwayTamltTw9I9j9wpGviR80YCxGBnN95b6Rz3GGKfPduIE-fQLmbmII4cOkcWSrq1I7KtrakRgXLhx7TwOSVUcE2UF9JfZCf-UM149yH1HU44y8Av0O_zaOLxSKcpP8K_qGc74BfCcumcuBsd1zWg7alSS17LZU_WebFryBDZaSFZXJABe9JlztvparVGJCNlvI1h93vcI5CopTdT2m2aQ"
  const fetchUserDetails = async () => {
    try {
      // Decode token to extract owner and name
      const { owner, name } = decodeToken(accessToken);
      
      // Fetch user data based on decoded owner and name
      const res = await axios.get(`https://authtest.cialabs.org/api/get-user?id=${owner}/${name}`,{
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`
      }});
    
      if (res?.data?.data) {
        setUser(res.data.data);
        console.log(user)
      } else {
        setStatus("Failed to fetch user details.");
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      setStatus("Error fetching user details.");
    }
  };

  const decodeToken = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("Error decoding token:", error);
      return {}; // Return empty object if decoding fails
    }
  };

  const generateKeys = async () => {
    try {
      // Construct the payload according to the required format
      const payload = {
        owner: user.owner || "",
          name: user.name || "",
          createdTime: new Date().toISOString(),
          accessKey: user.accessKey || "",
          accessSecret: user.accessSecret || "",
          accessToken:  accessToken || "",
          address: user.address || [],
          adfs: user.adfs || "",
          affiliation: user.affiliation || "",
          alipay: user.alipay || "",
          amazon: user.amazon || "",
          apple: user.apple || "",
          auth0: user.auth0 || "",
          avatar: user.avatar || "",
          avatarType: user.avatarType || "",
          azuread: user.azuread || "",
          azureadb2c: user.azureadb2c || "",
          baidu: user.baidu || "",
          balance: user.balance || 0,
          battlenet: user.battlenet || "",
          bilibili: user.bilibili || "",
          bio: user.bio || "",
          birthday: user.birthday || "",
          bitbucket: user.bitbucket || "",
          box: user.box || "",
          casdoor: user.casdoor || "",
          cloudfoundry: user.cloudfoundry || "",
          countryCode: user.countryCode || "US",
          createdIp: user.createdIp || "",
          currency: user.currency || "",
          custom: user.custom || "",
          dailymotion: user.dailymotion || "",
          deezer: user.deezer || "",
          deletedTime: user.deletedTime || "",
          digitalocean: user.digitalocean || "",
          dingtalk: user.dingtalk || "",
          discord: user.discord || "",
          displayName: user.displayName || "",
          douyin: user.douyin || "",
          dropbox: user.dropbox || "",
          education: user.education || "",
          email: user.email || "",
          emailVerified: user.emailVerified || false,
          eveonline: user.eveonline || "",
          externalId: user.externalId || "",
          faceIds: user.faceIds || null,
          facebook: user.facebook || "",
          firstName: user.firstName || "",
          fitbit: user.fitbit || "",
          gender: user.gender || "",
          gitea: user.gitea || "",
          gitee: user.gitee || "",
          github: user.github || "",
          gitlab: user.gitlab || "",
          google: user.google || "",
          groups: user.groups || [],
          hash: user.hash || "",
          heroku: user.heroku || "",
          homepage: user.homepage || "",
          id: user.id,
          idCard: user.idCard || "",
          idCardType: user.idCardType || "",
          influxcloud: user.influxcloud || "",
          infoflow: user.infoflow || "",
          instagram: user.instagram || "",
          intercom: user.intercom || "",
          invitation: user.invitation || "",
          invitationCode: user.invitationCode || "",
          isAdmin: user.isAdmin || false,
          isDefaultAvatar: user.isDefaultAvatar || false,
          isDeleted: user.isDeleted || false,
          isForbidden: user.isForbidden || false,
          isOnline: user.isOnline || false,
          kakao: user.kakao || "",
          karma: user.karma || 0,
          language: user.language || "",
          lark: user.lark || "",
          lastName: user.lastName || "",
          lastSigninIp: user.lastSigninIp || "",
          lastSigninTime: user.lastSigninTime || "",
          lastSigninWrongTime: user.lastSigninWrongTime || "",
          lastfm: user.lastfm || "",
          ldap: user.ldap || "",
          line: user.line || "",
          linkedin: user.linkedin || "",
          location: user.location || "",
          mailru: user.mailru || "",
          managedAccounts: user.managedAccounts || null,
          meetup: user.meetup || "",
          metamask: user.metamask || "",
          mfaAccounts: user.mfaAccounts || null,
          mfaEmailEnabled: user.mfaEmailEnabled || false,
          mfaPhoneEnabled: user.mfaPhoneEnabled || false,
          microsoftonline: user.microsoftonline || "",
          multiFactorAuths: user.multiFactorAuths || [
            { enabled: false, isPreferred: false, mfaType: "sms" }
          ],
          needUpdatePassword: user.needUpdatePassword || false,
          nextcloud: user.nextcloud || "",
          okta: user.okta || "",
          onedrive: user.onedrive || "",
          oura: user.oura || "",
          password: "***", // Placeholder for password, never send plaintext passwords
          passwordSalt: user.passwordSalt || "",
          passwordType: user.passwordType || "plain",
          patreon: user.patreon || "",
          paypal: user.paypal || "",
          permanentAvatar: user.permanentAvatar || "",
          permissions: user.permissions || [],
          phone: user.phone || "",
          preHash: user.preHash || "",
          preferredMfaType: user.preferredMfaType || "",
          properties: user.properties || {},
          ranking: user.ranking || 5,
          region: user.region || "",
          roles: user.roles || [],
          salesforce: user.salesforce || "",
          score: user.score || 2000,
          slack: user.slack || "",
          soundcloud: user.soundcloud || "",
          spotify: user.spotify || "",
          steam: user.steam || "",
          stripe: user.stripe || "",
          tag: user.tag || "staff",
          tiktok: user.tiktok || "",
          type: user.type || "normal-user",
          web3onboard: user.web3onboard || "",
          weibo: user.weibo || "",
          zoom: user.zoom || "",
          updatedTime: new Date().toISOString()
        
      };

      // Send the payload to add-user-keys endpoint
      const response = await axios.post("https://authtest.cialabs.org/api/add-user-keys", payload, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        },
        withCredentials: true
       
      });

      console.log(response)

      if (response.data.status === "ok") {
        setStatus("API keys generated and updated successfully!");
        // Fetch updated user details after key generation
        fetchUserDetails();
      } else {
        setStatus("Failed to update API keys.");
      }
    } catch (error) {
      console.error("Error generating keys:", error);
      setStatus("Error generating keys.");
    }
  };

  useEffect(() => {
    fetchUserDetails(); // Fetch user data when component mounts
  }, []); // Empty dependency array ensures this runs only once

  return (
    <div className="credentials-page">
      <h2>{service} Credentials</h2>
      <div className="credentials-table">
        <div className="credentials-row">
          <span className="credentials-label">User ID:</span>
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
      <button className="generate-btn" onClick={generateKeys}>Generate key and secret</button>
      <p>{status}</p>
    </div>
  );
};

export default CredentialsPage;
