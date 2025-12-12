const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "defaultsecret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

function signToken(user) {
  return jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password required" });

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });

    const token = signToken(user);
    res.json({ message: "User created", token, user: { id: user._id, email: user.email, name: user.name } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password required" });

    const user = await User.findOne({ email });
    if (!user || !user.password) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = signToken(user);
    res.json({ message: "Logged in", token, user: { id: user._id, email: user.email, name: user.name } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Accepts Google profile from frontend, creates or finds user, returns JWT
exports.oauth = async (req, res) => {
  try {
    const { id_token } = req.body || {};

    let profile = null;

    if (id_token) {
      // Verify id_token with Google's tokeninfo endpoint
      const tokeninfoUrl = `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(id_token)}`;
      const resp = await fetch(tokeninfoUrl);
      if (!resp.ok) return res.status(401).json({ message: "Invalid id_token" });
      const payload = await resp.json();

      // Optional: verify audience matches your Google client id
      const expectedAud = process.env.GOOGLE_CLIENT_ID;
      if (expectedAud && payload.aud && payload.aud !== expectedAud) {
        return res.status(401).json({ message: "Invalid token audience" });
      }

      // payload contains sub, email, name, picture, email_verified
      profile = {
        sub: payload.sub,
        email: payload.email,
        name: payload.name || payload.email.split("@")[0],
        picture: payload.picture,
      };
    } else {
      // Backwards compat: accept full profile object
      profile = req.body;
    }

    if (!profile) return res.status(400).json({ message: "Profile required" });

    const { sub: googleId, email, name, picture } = profile;
    if (!email) return res.status(400).json({ message: "Profile missing email" });

    // Try find by googleId first, then by email
    let user = null;
    if (googleId) user = await User.findOne({ googleId });
    if (!user) user = await User.findOne({ email });

    if (user) {
      // If user existed but didn't have googleId, set it
      if (googleId && !user.googleId) {
        user.googleId = googleId;
        user.picture = user.picture || picture;
        await user.save();
      }
    } else {
      // Create new user
      user = await User.create({ name, email, googleId, picture });
    }

    const token = signToken(user);
    res.json({ message: "OAuth success", token, user: { id: user._id, email: user.email, name: user.name, picture: user.picture } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "OAuth server error" });
  }
};
