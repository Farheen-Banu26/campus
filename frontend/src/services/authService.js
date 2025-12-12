import axios from "axios";

const API = "http://localhost:5000/api/auth";

export default {
  signup: (data) => axios.post(`${API}/signup`, data).then((res) => res.data),
  login: (data) => axios.post(`${API}/login`, data).then((res) => res.data),
  // Open a popup to Google's OAuth2 endpoint and await profile via postMessage
  googleSignIn: () =>
    new Promise((resolve, reject) => {
      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
      if (!clientId) return reject(new Error("Missing VITE_GOOGLE_CLIENT_ID"));

      const redirectUri = `${window.location.origin}/oauth2callback`;
      const scope = encodeURIComponent("openid profile email");
      const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(
        redirectUri
      )}&response_type=id_token&scope=${scope}&nonce=nonce`;

      const width = 520;
      const height = 630;
      const left = window.screenX + (window.innerWidth - width) / 2;
      const top = window.screenY + (window.innerHeight - height) / 2;

      const popup = window.open(
        url,
        "google_oauth",
        `width=${width},height=${height},left=${left},top=${top}`
      );

      if (!popup) return reject(new Error("Popup blocked"));

      const handler = (event) => {
        if (event.origin !== window.location.origin) return;
        const { type, id_token, error } = event.data || {};
        if (type === "google_auth") {
          window.removeEventListener("message", handler);
          if (error) return reject(new Error(error));
          return resolve(id_token);
        }
      };

      window.addEventListener("message", handler);

      const timer = setInterval(() => {
        if (popup.closed) {
          clearInterval(timer);
          window.removeEventListener("message", handler);
          reject(new Error("Popup closed by user"));
        }
      }, 500);
    }),

  // Send the id_token to backend for verification and create/login
  oauthLogin: (id_token) =>
    axios.post(`${API}/oauth`, { id_token }).then((res) => res.data),
};
