import { useState } from "react";
import { Link } from "react-router-dom";
import InputField from "../components/InputField";
import authService from "../services/authService";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    cpassword: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await authService.signup(form);
      alert(res.message);
    } catch (err) {
      console.error(err);
      alert("Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-700 via-blue-700 to-blue-900 p-4">
      <div className="w-full max-w-md bg-white/10 border border-white/20 rounded-3xl shadow-xl backdrop-blur-xl px-10 py-8">
        <h1 className="text-3xl font-semibold text-white mb-1">Create Account</h1>
        <p className="text-sm text-white/70 mb-6">Sign up to get started</p>

        <form onSubmit={handleSubmit}>
          <InputField
            label="Full Name"
            icon="user"
            name="name"
            value={form.name}
            onChange={handleChange}
          />
          <InputField
            label="Email Address"
            icon="email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
          />
          <InputField
            label="Password"
            icon="pass"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
          />
          <InputField
            label="Confirm Password"
            icon="pass"
            type="password"
            name="cpassword"
            value={form.cpassword}
            onChange={handleChange}
          />

          <button
            type="submit"
            className="mt-2 w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold hover:opacity-90 transition"
          >
            Create Account
          </button>
        </form>

        <p className="mt-4 text-sm text-white/80">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-200 font-semibold hover:underline">
            Sign In
          </Link>
        </p>

        <div className="flex items-center gap-3 my-5">
          <div className="h-px flex-1 bg-white/25" />
          <span className="text-xs text-white/60">Or continue with</span>
          <div className="h-px flex-1 bg-white/25" />
        </div>

        <div className="flex gap-3">
          <button
            onClick={async () => {
              try {
                const id_token = await authService.googleSignIn();
                console.log("Received id_token from popup");
                const res = await authService.oauthLogin(id_token);
                console.log("OAuth login response:", res);
                alert(`Signed in as ${res.user?.name || res.user?.email}`);
              } catch (err) {
                console.error(err);
                alert("Google sign-in failed: " + (err.message || err));
              }
            }}
            className="flex-1 py-2.5 rounded-xl bg-white/90 text-gray-800 text-sm font-medium hover:bg-white"
          >
            Google
          </button>
          <button className="flex-1 py-2.5 rounded-xl bg-[#1877F2] text-white text-sm font-medium hover:opacity-90">
            Facebook
          </button>
        </div>
      </div>
    </div>
  );
}
