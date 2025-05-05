import User from "../models/User.js";
import FriendRequest from "../models/FriendRequest.js";

export async function getRecommendedUsers(req, res) {
    try {
        const currentUserId = req.user.id;
        const currentUser = req.user;

        // Get all users except the current user
        const recommendedUsers = await User.find({
            _id: { $ne: currentUserId }, // Exclude current user
            isOnboarded: true, // Only include onboarded users
            _id: { $nin: currentUser.friends }, // exclude current user's friends
        })
        res.json({
            recommendedUsers
        });
    } catch (error) {
        console.error("Error fetching recommended users:", error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
}

export async function getMyFriends(req, res) {
    try {
        const user = await User.findById(req.user.id).select("friends").populate("friends", "fullName profilePicture nativeLanguage learningLanguage");

        res.status(200).json(user.friends);
    } catch (error) {
        console.error("Error in getMyFriends controller", error.message);
        res.status(500).json({message: "Internal Server Error"});
    }

}

export async function sendFriendRequest(req, res) {
    try {
        const myId = req.user.id;
        const { id: recipientId} = req.params;

        // Prevent sending a friend request to yourself
        if (myId === recipientId) {
            return res.status(400).json({message: "You cannot send a friend request to yourself."});
        }

        // Check if the recipient exists or not
        const recipient = await User.findById(recipientId);
        if(!recipient) {
            return res.status(404).json({message: "Recipient not found."});
        }

        // Check if the recipient is already a friend
        const isAlreadyFriend = recipient.friends.includes(myId);
        if(isAlreadyFriend) {
            return res.status(400).json({message: "You are already friends with this recipient."});
        }

        // Check if the recipient has already sent a friend request or request already exists
        const isAlreadyRequested = await FriendRequest.findOne({
            sender: myId,
            recipient: recipientId,            
            myId: recipientId,
            recipientId: myId
        });
        if(isAlreadyRequested) {
            return res.status(400).json({message: "Friend request already sent."});
        }

        // Create a new friend request
        const friendRequest = await FriendRequest.create({
            sender: myId,
            recipient: recipientId
        })
        res.status(201).json(friendRequest);
    } catch (error) {
        console.error("Error in sendFriendRequest controller", error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
}