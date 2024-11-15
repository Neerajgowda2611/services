import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '/home/silent/Desktop/services/frontend/src/App.css'; 
import axios from "axios";
import Cookies from 'js-cookie';

const CredentialsPage = () => {
  const { service } = useParams();
  const [user, setUser] = useState({});
  const [status, setStatus] = useState("");

  // Replace "token" with the actual access token
  
  const accessToken = Cookies.get('access_token');
  console.log(accessToken)
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
