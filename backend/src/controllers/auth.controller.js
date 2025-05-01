import User from "../models/Users.js";
import jwt from "jsonwebtoken";

export async function signup(req, res) {
  // Retrieves data from the frontend form (POST request)
  const { email, password, fullName } = req.body;

  try {
    // Basic Input Validation
    if (!email || !password || !fullName) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Password length validation
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    // Email format validation
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Email is not valid" });
    }

    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Generate random avatar - Sets a random avatar for the user
    const idx = Math.floor(Math.random() * 100) + 1;
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

    // Create new user - Creates a new user in the database The password is hashed automatically by the Mongoose.
    const newUser = new User({
      email,
      password,
      fullName,
      profilePicture: randomAvatar,
    });

    // Generate JWT token - Creates a JWT token for the user. [{ userId: newUser._id } This is the payload — the data you're storing inside the token.newUser._id is the unique ID that MongoDB gives to the user. You're storing this so you can identify the user later when they send the token back.]
    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "7d",
      }
    );

    /* What this does:
        This code tells the browser to store a cookie named "cookie" with the JWT token inside. That cookie will automatically be sent back with future requests (like when visiting a protected page).
        It's like saying:  “Hey browser, here’s a cookie. Its name is cookie, it contains a JWT, keep it for 7 days, don’t let JS touch it, and only send it back to me on safe, same-site, secure connections.”
    */

    // "cookie"	The name of the cookie you're setting.
    // token	The value (JWT) that you're storing inside the cookie.
    res.cookie("cookie", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000, // maxAge: 7 * 24 * 60 * 60 * 1000	The cookie will last for 7 days.
      httpOnly: true, // httpOnly: true	JavaScript can't access the cookie (helps protect against XSS attacks).
      sameSite: "strict", // sameSite: "strict"	Cookie only sent for same-site requests (helps protect against CSRF).
      secure: process.env.NODE_ENV === "production", // secure: process.env.NODE_ENV === "production"	Cookie sent only over HTTPS in production mode (extra security).
    });

    res.status(201).json({ success: true, user: newUser }); // Sends back the newly created user. It sends a JSON response back to the client (like the frontend), saying: ✅ Signup was successful! Here's the user we just created. user: newUser sends the details of the newly created user (from MongoDB).
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function login(req, res) {
  res.send("Login route");
}

export async function logout(req, res) {
  res.send("Logout route");
}
