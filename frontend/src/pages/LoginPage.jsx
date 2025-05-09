import { LifeBuoy } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router";
import useLogin from "../hooks/useLogin";

const LoginPage = () => {
  // The task of useState in React is to create and manage state in a functional component. It stores a value (like a variable) that can change over time (e.g., user input, toggles, counters). It triggers a re-render of the component when the value is updated, so the UI stays in sync with the current state.
  // Declare a state variable 'loginData' with initial values for 'email' and 'password' as empty strings.
  // 'setLoginData' is the function used to update this state.
  // This state is typically used to manage user input in a login form.
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const {isPending, error, loginMutation} = useLogin();

  // This function runs when we login
  const handleLogin = (e) => {
    // Prevent the default form submission behavior
    e.preventDefault(); // This stops the page from refreshing (which is the default form behavior in HTML).
    // Call the login mutation with the login data
    loginMutation(loginData);
  };

  return (
    <div
      className="h-screen flex items-center justify-center p-4 sm:p-6 md:p-8"
      data-theme="autumn"
    >
      <div className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden">
        {/* Login Form */}
        <div className="w-full lg:w-1/2 p-4 sm:p-8 flex flex-col">
          {/* Logo */}
          <div className="mb-4 flex items-center justify-start gap-2">
            <LifeBuoy className="size-9 text-primary" />
            <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
              Calligo
            </span>
          </div>

          {/* Error */}
          {error && (
            <div className="alert alert-error shadow-lg mb-4">
              <span>{error.response.data.message}</span>
            </div>
          )}

          <div className="w-full">
            <form onSubmit={handleLogin}>
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold">Welcome Back</h2>
                  <p className="text-sm opacity-70">
                    Sign in to your account to continue your language journey.
                  </p>

                  <div className="flex flex-col gap-3">
                    <div className="form-control w-full space-y-2">
                      <label className="label">
                        <span className="label-text">Email Address</span>
                      </label>
                      <input
                        type="email"
                        placeholder="luna@calligo.app"
                        className="input input-bordered w-full"
                        value={loginData.email}
                        onChange={(e) =>
                          setLoginData({
                            ...loginData,
                            email: e.target.value,
                          })
                        }
                        required
                      />
                    </div>

                    <div className="form-control w-full space-y-2">
                      <label className="label">
                        <span className="label-text font-semibold">
                          Login Password
                        </span>
                      </label>

                      <input
                        type="password"
                        placeholder="********"
                        className="input input-bordered w-full"
                        value={loginData.password}
                        onChange={(e) =>
                          setLoginData({
                            ...loginData,
                            password: e.target.value,
                          })
                        }
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary w-full"
                      disabled={isPending}
                    >
                      {isPending ? (
                        <>
                          <span className="loading loading-spinner loading-xs">
                            Signing in...
                          </span>
                        </>
                      ) : (
                        "Sign In"
                      )}
                    </button>

                    <div className="text-center mt-4">
                      <p className="text-sm">
                        Don't have an account?{" "}
                        <Link
                          className="text-primary hover:underline"
                          to="/signup"
                        >
                          Create one
                        </Link>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Image Section */}
        <div className="hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center">
          <div className="max-w-md p-8">
            <div className="relative aspect-square max-w-sm mx-auto">
              <img src="/vc.png" className="w-full h-full"/>
            </div>

            <div className="text-center space-y-3 mt-6">
              <h2 className="text-xl font-semibold">Talk & Talk, Anywhere in the World</h2>
              <p className="opacity-70 text-xs tracking-tight">
                From casual chats to cultural exchanges - Calligo is your passport to better conversations.
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
