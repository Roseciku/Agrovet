const supabase = require('../config/supabaseClient');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
require("dotenv").config();

// REGISTER A USER
exports.registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Please correct input errors",
      errors: errors.array(),
    });
  }

  const { name, email, password, role } = req.body;

  try {
    // Check if email already exists
    const { data: existingUsers, error: existingError } = await supabase
      .from("users")
      .select("email")
      .eq("email", email);

    if (existingError) {
      console.error("Error checking existing users:", existingError);
      return res.status(500).json({
        message: "Error checking if user exists",
        error: existingError.message,
      });
    }

    if (existingUsers && existingUsers.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Default role
    const userRole =
      role && role.toLowerCase() === "admin" ? "admin" : "user";

    // Insert new user
    const { error: insertError } = await supabase
      .from("users")
      .insert([{ name, email, password: hashedPassword, role: userRole }]);

    if (insertError) {
      console.error("Error inserting user:", insertError);
      return res.status(500).json({
        message: "Error registering user",
        error: insertError.message,
      });
    }

    return res.status(201).json({
       message: "User registered successfully!" ,
      user: data[0]
      });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({
      message: "An error occurred during registration",
      error: error.message,
    });
  }
};

// LOGIN A USER
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const { data: users, error: userError } = await supabase
      .from("users")
      .select("user_id, name, email, password, role")
      .eq("email", email)
      .limit(1);

    if (userError) {
      console.error("Error fetching user:", userError);
      return res.status(500).json({
        message: "Database error fetching user",
        error: userError.message,
      });
    }

    if (!users || users.length === 0) {
      return res.status(400).json({ message: "The user does not exist" });
    }

    const user = users[0];

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email/password" });
    }

    // Generate JWTs
    const accessToken = jwt.sign(
      { user_id: user.user_id, email: user.email, role: user.role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { user_id: user.user_id, email: user.email, role: user.role },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    // Save refresh token
    const { error: tokenError } = await supabase
      .from("refresh_tokens")
      .insert([{ user_id: user.user_id, refreshtoken: refreshToken }]);

    if (tokenError) {
      console.error("Error saving refresh token:", tokenError);
      return res.status(500).json({
        message: "Error saving refresh token",
        error: tokenError.message,
      });
    }

    // Send cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    // Response
    return res.status(200).json({
      accessToken,
      user: {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({
      message: "An error occurred during login",
      error: error.message,
    });
  }
};

// REFRESH TOKEN
exports.refreshToken = async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    console.log("Cookies received:", req.cookies);
    return res.status(401).json({ message: "No refresh token found" });
    }

  try {
    // Check if refresh token exists
    const { data: tokens, error: tokenErr } = await supabase
      .from("refresh_tokens")
      .select("*")
      .eq("refreshtoken", refreshToken);

    if (tokenErr) {
      console.error("Error checking refresh token:", tokenErr);
      return res.status(500).json({
        message: "Error checking refresh token",
        error: tokenErr.message,
      });
    }

    if (!tokens || tokens.length === 0) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    // Verify token
    const decodedData = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    // Fetch user
    const { data: users, error: userErr } = await supabase
      .from("users")
      .select("user_id, name, email, role")
      .eq("user_id", decodedData.user_id)
      .limit(1);

    if (userErr) {
      console.error("Error fetching user for refresh:", userErr);
      return res.status(500).json({
        message: "Error fetching user during refresh",
        error: userErr.message,
      });
    }

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = users[0];

    // Generate new access token
    const accessToken = jwt.sign(
      { user_id: user.user_id, email: user.email, role: user.role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    return res.json({
      accessToken,
      user,
    });
  } catch (error) {
    console.error("Error refreshing token:", error);
    res.status(500).json({ message: "Error refreshing token" });
  }
};

// LOGOUT USER
exports.logoutUser = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.refreshToken) {
    return res
      .status(200)
      .json({ message: "No token to clear, already logged out" });
  }

  const refreshToken = cookies.refreshToken;

  try {
    // Check if refresh token exists
    const { data: tokens, error: tokenErr } = await supabase
      .from("refresh_tokens")
      .select("*")
      .eq("refreshtoken", refreshToken);

    if (tokenErr) {
      console.error("Error checking refresh token on logout:", tokenErr);
      return res.status(500).json({
        message: "Error checking refresh token during logout",
        error: tokenErr.message,
      });
    }

    // Delete refresh token if found
    if (tokens && tokens.length > 0) {
      const { error: delErr } = await supabase
        .from("refresh_tokens")
        .delete()
        .eq("refreshtoken", refreshToken);

      if (delErr) {
        console.error("Error deleting refresh token:", delErr);
        return res.status(500).json({
          message: "Error deleting refresh token",
          error: delErr.message,
        });
      }
    }

    // Clear cookie
    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "None",
      secure: true,
    });

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error during logout:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
