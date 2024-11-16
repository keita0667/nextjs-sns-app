"use client"

import { followUser } from "@/lib/actions"
import { Button } from "../ui/button"
import { useOptimistic } from "react"

interface FollowButtonProps {
  isCurrentUser: boolean,
  isFollowing: boolean,
  profileUserId: string,
}

const FollowButton = ({
  isCurrentUser,
  isFollowing,
  profileUserId,
}: FollowButtonProps
) => {

  const [optimisticFollow, addOptimisticFollow] = useOptimistic<
    {
      isFollowing: boolean
    },
    void
  >({
    isFollowing: isFollowing
  }, (currentState) => ({
      isFollowing:  !currentState.isFollowing
    })
  )

  const getButtonContent = () => {
    if (isCurrentUser) {
      return "プロフィール編集"
    } else if (optimisticFollow.isFollowing) {
      return "フォロー中"
    } else {
      return "フォローする"
    }
  }

  const getButtonVariant = () => {
    if (isCurrentUser) {
      return "secondary"
    } else if (optimisticFollow.isFollowing) {
      return "outline"
    } else {
      return "default"
    }
  }

  const handleFollowAction = async() => {
    try {
      if (isCurrentUser) {
        return
      }
      addOptimisticFollow()
      await followUser(profileUserId)
    } catch(err) {
      console.log(err)
    }
  }

  return (
    <div>
      <form action={handleFollowAction}>
        <Button className="w-full" variant={getButtonVariant()}>{getButtonContent()}</Button>
      </form>
    </div>
  )
}

export default FollowButton
