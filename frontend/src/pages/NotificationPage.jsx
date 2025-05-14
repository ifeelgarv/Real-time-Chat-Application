import {useQuery, useQueryClient} from "@tanstack/react-query";

const NotificationPage = () => {
  const queryClient = useQueryClient();

  const [data, isLoading] = useQuery({
    queryKey: ['friendRequests'],
    queryFn: getFriendRequests,

  })
  return (
    <div>
      Notification
    </div>
  )
}

export default NotificationPage
