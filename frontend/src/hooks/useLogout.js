import { logout } from '../lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const useLogout = () => {
  const queryClient = useQueryClient();
  const { mutate: logoutMutation, isPending, error } = useMutation({
    mutationFn: logout,
    onSuccess: () => queryClient.invalidateQueries(["authUser"]),
  });
  return {logoutMutation, isPending, error};
}

export default useLogout
