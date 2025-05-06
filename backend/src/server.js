import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import chatRoutes from "./routes/chat.route.js";

import { connectDB } from "./lib/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

// app.use(express.json()); This line tells your server how to understand data sent from the frontend in JSON format (like from a signup or login form). Imagine someone sends your server a letter written in JSON language — this line is like giving your server a translator so it can read that letter properly. Without it, your server will look at the letter (data) and say: “I don’t understand what this is” — and req.body will be empty or undefined
app.use(express.json());
app.use(cookieParser()); // This line is like giving your server a special tool to read cookies. Cookies are small pieces of data that websites store in your browser. When someone sends a cookie to your server, this line helps your server understand what that cookie says.

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
