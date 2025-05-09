import { useMutation, useQueryClient } from '@tanstack/react-query';
import { login } from '../lib/api';

const useLogin = () => {
  // This access the current QueryClient instance, which is used to manage and cache server state in React Query. It allows you to perform operations like fetching, updating, or invalidating queries.
  // In this case, it's likely used to manage the authentication state or user data after login.
  const queryClient = useQueryClient();

  const {
    mutate,
    isPending,
    error,
  } = useMutation({
    mutationFn: login, // This is the function that actually sends the form to the server.
    // To specify what should happen after a mutation is successful. Or once the mutation is successfully completed, the function inside onSuccess is triggered. here data represents the response data that is returned when the mutation completes successfully.
    // This function runs when the login is successful
    // It invalidates the "authUser" query, which means it will refetch the user data from the server to ensure that the application has the most up-to-date information about the logged-in user.
    // This is important because after logging in, the user data might have changed (e.g., new token, user info), and you want to make sure the app reflects that.
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),
  });

  return {
    loginMutation: mutate,
    isPending,
    error,
  };
}

export default useLogin;
