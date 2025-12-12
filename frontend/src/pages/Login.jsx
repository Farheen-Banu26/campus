import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaGoogle,
  FaFacebookF,
} from "react-icons/fa";
import authService from "../services/authService";

export default function Login() {
  const [show, setShow] = useState(false);

  return (
    <div
      className="
        min-h-screen flex items-center justify-center p-4 relative overflow-hidden
        bg-black
        bg-[radial-gradient(circle_at_center,_rgba(0,255,200,0.05),_transparent_60%)]

        before:absolute 
        before:inset-0 
        before:bg-[conic-gradient(at_50%_50%,_#0f0,_#00f,_#8000ff,_#0f0)] 
        before:opacity-10 
        before:blur-3xl

        after:absolute 
        after:inset-0 
        after:bg-[url('https://assets.codepen.io/1462889/glitch-lines.png')] 
        after:bg-cover 
        after:mix-blend-overlay 
        after:opacity-20
      "
    >
      {/* Abstract Neon Orbs */}
      <div className="absolute w-96 h-96 bg-purple-700/40 rounded-full blur-[120px] top-10 left-10"></div>
      <div className="absolute w-80 h-80 bg-green-500/40 rounded-full blur-[120px] bottom-10 right-10"></div>
      <div className="absolute w-64 h-64 bg-blue-600/30 rounded-full blur-[100px] top-1/2 left-1/2 -translate-x-1/2"></div>

      {/* Floating Glitch Shapes */}
      <div className="absolute top-20 right-32 w-32 h-32 border border-purple-500/40 rotate-12 animate-pulse"></div>
      <div className="absolute bottom-24 left-24 w-40 h-40 border border-green-400/30 -rotate-12 animate-ping"></div>

      <div
        className="
          relative w-full max-w-md 
          bg-white/5 
          backdrop-blur-2xl 
          rounded-3xl 
          border border-white/20 
          px-10 py-8 
          shadow-[0_0_50px_rgba(0,255,200,0.3),0_0_80px_rgba(138,43,226,0.3)]
        "
      >
        {/* Glitch Overlay */}
        <div className="absolute inset-0 bg-[url('https://assets.codepen.io/1462889/glitch-effect.png')] opacity-10 mix-blend-overlay pointer-events-none"></div>

        {/* Top Icon */}
        <div className="flex justify-center mb-4">
          <div
            className="
              w-16 h-16 rounded-full 
              bg-white/10 
              backdrop-blur-md 
              flex items-center justify-center 
              text-white text-3xl 
              shadow-[0_0_20px_rgba(255,255,255,0.5)]
            "
          >
            👁️
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl text-white font-extrabold text-center mb-1 tracking-wider drop-shadow-lg">
          Enter the Void
        </h1>
        <p className="text-center text-white/60 mb-6 text-sm">
          Authenticate through the cyber-realm
        </p>

        {/* Email */}
        <label className="text-white text-sm">Username / Email</label>
        <div
          className="
            flex items-center 
            bg-white/5 
            border border-white/20 
            rounded-xl 
            px-4 py-3 mt-1 mb-4 
            shadow-[0_0_15px_rgba(0,255,200,0.2)]
          "
        >
          <FaEnvelope className="text-neonBlue text-lg mr-3" />
          <input
            type="email"
            placeholder="Enter your email"
            className="
              bg-transparent text-white 
              placeholder-white/40 
              w-full outline-none text-sm
            "
          />
        </div>

        {/* Password */}
        <label className="text-white text-sm">Password</label>
        <div
          className="
            flex items-center 
            bg-white/5 
            border border-white/20 
            rounded-xl 
            px-4 py-3 mt-1 mb-2
            shadow-[0_0_15px_rgba(138,43,226,0.25)]
          "
        >
          <FaLock className="text-purple-300 text-lg mr-3" />
          <input
            type={show ? "text" : "password"}
            placeholder="Enter your password"
            className="
              bg-transparent text-white placeholder-white/40 
              w-full outline-none text-sm
            "
          />
          <button onClick={() => setShow(!show)} className="text-white/60 text-lg">
            {show ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        {/* Remember / Forgot */}
        <div className="flex justify-between text-xs text-white/60 mb-5">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="accent-purple-500" />
            Remember me
          </label>
          <button className="hover:underline">Forgot password?</button>
        </div>

        {/* Sign In Button */}
        <button
          className="
            w-full py-3 
            bg-gradient-to-r 
            from-purple-700 via-blue-600 to-green-500 
            text-white text-sm font-semibold 
            rounded-xl 
            shadow-[0_0_25px_rgba(0,255,200,0.4)]
            hover:scale-[1.02] transition-all
          "
        >
          Enter Portal
        </button>

        {/* Sign Up Link */}
        <p className="text-center text-white/70 text-sm mb-4 mt-5">
          New here?{" "}
          <Link className="text-purple-300 font-bold hover:underline" to="/signup">
            Create an account
          </Link>
        </p>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1 h-px bg-white/20"></div>
          <span className="text-white/40 text-xs">Or connect via</span>
          <div className="flex-1 h-px bg-white/20"></div>
        </div>

        {/* Social Buttons */}
        <div className="flex gap-4">
          <button
            onClick={async () => {
              try {
                const id_token = await authService.googleSignIn();
                const res = await authService.oauthLogin(id_token);
                alert(`Signed in as ${res.user?.name || res.user?.email}`);
              } catch (err) {
                alert("Google sign-in failed: " + (err.message || err));
              }
            }}
            className="
              flex-1 flex items-center justify-center gap-2 
              py-2 bg-white/10 
              border border-white/30 
              rounded-xl text-white text-sm
              hover:bg-white/20
            "
          >
            <FaGoogle className="text-lg" /> Google
          </button>

          <button
            className="
              flex-1 flex items-center justify-center gap-2 
              py-2 bg-blue-700/80 rounded-xl 
              text-white text-sm hover:bg-blue-800
            "
          >
            <FaFacebookF className="text-lg" /> Facebook
          </button>
        </div>
      </div>
    </div>
  );
}
