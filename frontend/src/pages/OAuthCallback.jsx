import { useEffect } from "react";

export default function OAuthCallback() {
  useEffect(() => {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.replace(/^#/, ""));
    const id_token = params.get("id_token");
    const error = params.get("error");

    if (error) {
      if (window.opener) {
        window.opener.postMessage({ type: "google_auth", error }, window.location.origin);
      }
      return;
    }

    if (!id_token) {
      if (window.opener) {
        window.opener.postMessage({ type: "google_auth", error: "No id_token" }, window.location.origin);
      }
      return;
    }

    // Post the id_token back to opener; backend will verify it using Google's tokeninfo endpoint
    if (window.opener) {
      window.opener.postMessage({ type: "google_auth", id_token }, window.location.origin);
    }

    setTimeout(() => window.close(), 500);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div>Completing sign-in…</div>
    </div>
  );
}
