import User from "../models/User";

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