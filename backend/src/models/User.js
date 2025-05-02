import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    bio: {
      type: String,
      default: "",
    },
    profilePicture: {
      type: String,
      default: "",
    },
    nativeLanguage: {
      type: String,
      default: "",
    },
    learningLanguage: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    isOnboarded: {
      type: Boolean,
      default: false,
    },

    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

// Mongoose pre-save middleware to hash password before saving the user document to MongoDB database.
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  try {
    // Ensures that passwords are securely hashed before being saved. Automatically handles hashing during user creation or password update.
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// You're adding a custom method to the userSchema called matchPassword. This method will be available on all User instances created from this schema. It takes one argument: enteredPassword (the password entered by the user during login).
userSchema.methods.matchPassword = async function (enteredPassword) {

  // bcrypt.compare() checks if the entered password (plain text) matches the hashed password stored in the database (this.password). this.password refers to the current user's hashed password. It returns true if they match, otherwise false.
  const isPasswordValid = await bcrypt.compare(enteredPassword, this.password);

  // If the passwords match, isPasswordValid will be true. If they don't match, it will be false.
  return isPasswordValid;
}

const User = mongoose.model("User", userSchema);

export default User;


/*
What is .methods in Mongoose?
userSchema.methods is where you define custom instance methods.
These methods can be used on individual documents (e.g., a specific user).

So later in your login logic, you can call:
const isPasswordValid = await user.matchPassword(password);
This works because matchPassword is attached to the schema using .methods
*/