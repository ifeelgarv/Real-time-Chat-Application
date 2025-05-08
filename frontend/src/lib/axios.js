import axios from "axios";

// You’re creating a custom version of axios called axiosInstance, which you can reuse anywhere in your app.
export const axiosInstance = axios.create({
  // This is the base URL for all your API requests.
  // So if you call axiosInstance.get('/auth/signup'), the final URL will be:
  // http://localhost:3000/api/auth/signup
  baseURL: "http://localhost:3000/api",

  // This tells axios to include cookies (like session tokens) in requests.
  // It's important for authentication when working with cookies.
  withCredentials: true,
});

//  instead of using plain axios everywhere, we create an axiosInstance with some default settings (like base URL, headers, or token). This helps you avoid repeating the same config again and again.
