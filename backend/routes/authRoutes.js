const express = require("express");
const router = express.Router();
const { signup, login, oauth } = require("../controllers/authController");

// POST /api/auth/signup
router.post("/signup", signup);

// POST /api/auth/login
router.post("/login", login);

// POST /api/auth/oauth
router.post("/oauth", oauth);

module.exports = router;
