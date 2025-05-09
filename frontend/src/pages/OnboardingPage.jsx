import React, { useState } from "react";
import useAuthUser from "../hooks/useAuthUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast, { LoaderIcon } from "react-hot-toast";
import { completeOnboarding } from "../lib/api";
import {
  CameraIcon,
  MapPinIcon,
  ShipWheelIcon,
  ShuffleIcon,
} from "lucide-react";
import { LANGUAGES } from "../constants";

const OnboardingPage = () => {
  const { authUser } = useAuthUser(); // This gets authenticated or looggedIn user data from a custom hook called useAuthUser
  const queryClient = useQueryClient();
  const [formState, setFormState] = useState({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    nativeLanguage: authUser?.nativeLanguage || "",
    learningLanguage: authUser?.learningLanguage || "",
    location: authUser?.location || "",
    profilePicture: authUser?.profilePicture || "",
  });

  // Mutation or useMutation for requests that modify data.
  const { mutate: onboardingMutation, isPending } = useMutation({
    mutationFn: completeOnboarding, // This is the function that actually sends the form to the server.

    // To specify what should happen after a mutation is successful. Or once the mutation is successfully completed, the function inside onSuccess is triggered. here data represents the response data that is returned when the mutation completes successfully.
    onSuccess: (data) => {
      toast.success("Profile onboarded successfully");
      queryClient.invalidateQueries({ queryKey: ["authUser"] }); // ensures that React Query fetches fresh data about the logged-in user by invalidating the query related to authUser, so that the next time the app needs to display user data, it gets the updated data.
    },

    onError: (error) => {
      toast.error(error.response.data.message);
      // This is a way to show an error message to the user if something goes wrong when trying to complete the onboarding process. It uses the toast library to display a notification with the error message.
    }
  });

  // This function runs when the form is submitted
  const handleSubmit = (e) => {
    e.preventDefault(); // This stops the page from refreshing (which is the default form behavior in HTML).
    onboardingMutation(formState); // This sends the data in formState (user’s name, bio, language, avatar, etc.) to the server. It uses the mutation function (which usually means a POST or PUT request) to save or update the data.
  };

  // This function runs when the user wants to generate a random avatar.
  const handleRandomAvatar = () => {
    const idx = Math.floor(Math.random() * 100) + 1; // Math.random() gives a random number from 0 to just below 1. Multiplying by 100 gives a range from 0 to 99.999.. Math.floor(...) rounds it down to an integer from 0 to 99. + 1 shifts it to 1 to 100, which matches the avatar image names.
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

    setFormState({ ...formState, profilePicture: randomAvatar }); // It will keep all previous values and but update or add the profile picture field with the new random avatar.
    toast.success("Random Avatar Generated");
  };
  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
      <div className="card bg-base-200 w-full max-w-3xl shadow-xl">
        <div className="card-body p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">
            Complete Your Profile
          </h1>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Profile Picture */}
            <div className="flex flex-col items-center justify-center space-y-4">
              {/* Image Preview */}
              <div className="size-32 rounded-full bg-base-300 overflow-hidden">
                {formState.profilePicture ? (
                  <img
                    src={formState.profilePicture}
                    alt="Profile Picture"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <CameraIcon className="size-12 text-base-content opacity-40" />
                  </div>
                )}
              </div>

              {/* Random Avatar */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleRandomAvatar}
                  className="btn btn-accent"
                >
                  <ShuffleIcon className="size-4 mr-2" />
                  Generate Random Avatar
                </button>
              </div>
            </div>

            {/* Full Name */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Full Name</span>
              </label>
              <input
                type="text"
                value={formState.fullName}
                onChange={(e) =>
                  setFormState({ ...formState, fullName: e.target.value })
                }
                className="input input-bordered w-full"
                placeholder="Enter your full name"
              />
            </div>

            {/* Bio */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Bio</span>
              </label>
              <textarea
                value={formState.bio}
                onChange={(e) =>
                  setFormState({ ...formState, bio: e.target.value })
                }
                className="textarea textarea-bordered h-24"
                placeholder="Tell others about yourself and your language learning goals"
              />
            </div>

            {/* Language */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Native Language */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Native Language</span>
                </label>
                <select
                  value={formState.nativeLanguage} // value shows what is in the state
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      nativeLanguage: e.target.value,
                    })
                  } // onChange updates the state when you type in the input field
                  className="select select-bordered w-full"
                >
                  <option value="">Select your native language</option>
                  {LANGUAGES.map((lang) => (
                    <option
                      key={`native-${lang}`}
                      value={lang.toLocaleLowerCase()}
                    >
                      {lang}
                    </option>
                  ))}
                </select>
              </div>

              {/* Learning Language */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Learning Language</span>
                </label>
                <select
                  value={formState.learningLanguage}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      learningLanguage: e.target.value,
                    })
                  }
                  className="select select-bordered w-full"
                >
                  <option value="">Select language you're learning</option>
                  {LANGUAGES.map((lang) => (
                    <option key={`learning-${lang}`} value={lang.toLowerCase()}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Location */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Location</span>
              </label>
              <div className="relative">
                <MapPinIcon className="absolute top-1/2 transform -translate-y-1/2 left-3 size-5 text-base-content opacity-70" />

                <input
                  type="text"
                  value={formState.location}
                  onChange={(e) =>
                    setFormState({ ...formState, location: e.target.value })
                  }
                  className="input input-bordered w-full pl-10"
                  placeholder="City, Country"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              className="btn btn-primary w-full"
              disabled={isPending}
              // This disables the button if isPending is true
              // (meaning something is loading or processing)
            >
              {!isPending ? (
                <>
                  <ShipWheelIcon className="size-5 mr-2" />
                  Complete Onboarding
                </>
              ) : (
                <>
                  <LoaderIcon className="animate-spin size-5 mr-2" />
                  Onboarding...
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
