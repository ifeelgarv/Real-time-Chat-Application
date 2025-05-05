import express from 'express';
import { protectRoute } from '../middleware/auth.middleware';
import { getMyFriends, getRecommendedUsers } from '../controllers/user.controller';

const router = express.Router();

// Applying auth middleware to all routes in this file
router.use(protectRoute);

router.get("/", getRecommendedUsers);
router.get("/friends", getMyFriends);

router.post("/friend-request/:id", sendFriendRequest);

export default router;