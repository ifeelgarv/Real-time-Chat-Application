import express from 'express';
import { login, logout, signup, onboard } from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post("/signup", signup); // Register a new user
router.post("/login", login); // Login a user with credentials
router.post("/logout", logout); // Log out the current user
router.post("/onboarding", protectRoute, onboard); // Onboard a user

// Todo: forget-password route, reset-password/:token route, change-password route.

// This route is used to get the user data
router.get("/me", protectRoute, (req, res) => {
    res.status(200).json({
        success: true,
        user: req.user
    })
})
export default router;