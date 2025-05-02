import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protectRoute = async (req, res, next) => {
    try {
        // Get the token from the "token" cookie
        const token = req.cookies.token;

        // If token doesn't exist, return an error
        if(!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if (!decoded) {
            return res.status(401).json({ message: "Unauthorized: Invalid token" });
        }

        // This line is querying the database to find a user by their userId, which was part of the decoded JWT payload (decoded.userId). What happens: It searches the User collection in the database for the user that matches the userId stored in the token.
        const user = await User.findById(decoded.userId).select("-password"); // Exclude password from the user object
        if (!user) {
            return res.status(401).json({ message: "Unauthorized: User not found" });
        }

        // By adding the user to req.user, you make the user's data available in the request object (req) for later use in your route handler or middleware. This allows subsequent middleware or routes to easily access the user's information (e.g., req.user.email)
        req.user = user;
        next();
    } catch (error) {
        console.error("Error in protectRoute middleware:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// If you're storing a JWT or session token in a cookie (like in your signup/login flow), you’ll likely need to read that cookie later for authentication. cookie-parser makes that simple.

// The purpose of these lines is to authenticate the user for every protected route by verifying their JWT token, then attaching the user's information to the request object so that it can be used throughout the route handler. For example, when accessing a route like GET /profile, you can now access req.user to know which user is making the request.