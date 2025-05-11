import User from "../models/User.js";
import FriendRequest from "../models/FriendRequest.js";

export async function getRecommendedUsers(req, res) {
  try {
    const currentUserId = req.user.id;
    const currentUser = req.user;

    // Get all users except the current user
    const recommendedUsers = await User.find({
      $and: [
        { _id: { $ne: currentUserId }}, // Exclude current user
        {_id: { $nin: currentUser.friends }}, // exclude current user's friends
        {isOnboarded: true,} // Only include onboarded users
      ],  
    });
    res.status(200).json({
      recommendedUsers,
    });
  } catch (error) {
    console.log("Error fetching recommended users:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getMyFriends(req, res) {
  try {
    const user = await User.findById(req.user.id)
      .select("friends")
      .populate(
        "friends",
        "fullName profilePicture nativeLanguage learningLanguage"
      );

    res.status(200).json(user.friends);
  } catch (error) {
    console.log("Error in getMyFriends controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function sendFriendRequest(req, res) {
  try {
    const myId = req.user.id;
    const { id: recipientId } = req.params;

    // Prevent sending a friend request to yourself
    if (myId === recipientId) {
      return res
        .status(400)
        .json({ message: "You cannot send a friend request to yourself." });
    }

    // Check if the recipient exists or not
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: "Recipient not found." });
    }

    // Check if the recipient is already a friend
    const isAlreadyFriend = recipient.friends.includes(myId);
    if (isAlreadyFriend) {
      return res
        .status(400)
        .json({ message: "You are already friends with this recipient." });
    }

    // Check if the recipient has already sent a friend request or request already exists
    const isAlreadyRequested = await FriendRequest.findOne({
      $or: [
        { sender: myId, recipient: recipientId },
        { sender: recipientId, recipient: myId }
      ],
    });
    
    if (isAlreadyRequested) {
      return res.status(400).json({ message: "Friend request already sent." });
    }

    // Create a new friend request
    const friendRequest = await FriendRequest.create({
      sender: myId,
      recipient: recipientId,
    });
    res.status(201).json(friendRequest);
  } catch (error) {
    console.log("Error in sendFriendRequest controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function acceptFriendRequest(req, res) {
  try {
    const { id: requestId } = req.params;
    const friendRequest = await FriendRequest.findById(requestId);
    if (!friendRequest) {
      return res.status(404).json({ message: "Friend request not found." });
    }

    // verify the current user is the recipient of the friend request
    if (friendRequest.recipient.toString() !== req.user.id) {
      return res
        .status(403)
        .json({
          message: "You are not authorized to accept this friend request.",
        });
    }

    friendRequest.status = "accepted";
    await friendRequest.save();

    // Add each user to the other's friends list
    const sender = await User.findById(friendRequest.sender);
    const recipient = await User.findById(friendRequest.recipient);
    sender.friends.push(recipient._id);
    recipient.friends.push(sender._id);

    await sender.save();
    await recipient.save();
    res.status(200).json({ message: "Friend request accepted." });
  } catch (error) {
    console.log("Error in acceptFriendRequest controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function declineFriendRequest(req, res) {
  try {
    const { id: requestId } = req.params;
    const friendRequest = await FriendRequest.findById(requestId);
    if (!friendRequest) {
      return res.status(404).json({ message: "Friend request not found." });
    }

    // verify the current user is the recipient of the friend request
    if (friendRequest.recipient.toString() !== req.user.id) {
      return res
        .status(403)
        .json({
          message: "You are not authorized to decline this friend request.",
        });
    }

    friendRequest.status = "declined";
    await friendRequest.save();

    res.status(200).json({ message: "Friend request declined." });
  } catch (error) {
    console.log("Error in declineFriendRequest controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getFriendRequests(req, res) {
  try {
    const incomingRequests = await FriendRequest.find({
      recipient: req.user.id,
      status: "pending",
    }).populate(
      "sender",
      "fullName profilePicture nativeLanguage learningLanguage"
    );

    const acceptedReqs = await FriendRequest.find({
      sender: req.user.id,
      status: "accepted",
    }).populate("recipient", "fullName profilePicture");

    res.status(200).json({ incomingRequests, acceptedReqs });
  } catch (error) {
    console.error(
      "Error in getPendingFriendRequests controller",
      error.message
    );
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getOutgoingFriendRequests(req, res) {
  try {
    const outgoingRequests = await FriendRequest.find({
      sender: req.user.id,
      status: "pending",
    }).populate(
      "recipient",
      "fullName profilePicture nativeLanguage learningLanguage"
    );

    res.status(200).json(outgoingRequests);
  } catch (error) {
    console.log("Error in getOutgoingFriendRequests controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
