"use client";

import { likeAction } from "@/lib/actions";
import { Button } from "../ui/button"
import { HeartIcon, MessageCircleIcon, Share2Icon } from "./Icons"
import { useOptimistic } from "react";
import { useAuth } from "@clerk/nextjs";

type PostInteractionProps = {
  postId: string;
  initialLikes: string[];
  commentNumber: number;
}

interface LikeState {
  likeCount: number,
  isLiked: boolean,
}

const PostInteraction = ({ postId, initialLikes, commentNumber }: PostInteractionProps) => {
  
  const { userId } = useAuth();

  const initialState = {
    likeCount: initialLikes.length,
    isLiked: userId ? initialLikes.includes(userId) : false,
  }

  const [optimisticLike, addOptimisticLike] = useOptimistic<LikeState, void>(
    initialState,(currentState) => ({
      likeCount: currentState.isLiked ?
        currentState.likeCount - 1 :
        currentState.likeCount + 1,
      isLiked: !currentState.isLiked,
    })
  )

  const handleLikeSubmit = async() => {
    try {
      addOptimisticLike()
      await likeAction(postId)
    } catch(err) {
      console.log(err)
    }
  }

  return (
    <div className="flex items-center">
      <form action={handleLikeSubmit}>
        <Button variant="ghost" size="icon">
          <HeartIcon className={`h-5 w-5 ${
            optimisticLike.isLiked ? "text-destructive" : "text-muted-foreground"
          }`} />
        </Button>
      </form>
      <span className={`-ml-1 ${optimisticLike.isLiked ? "text-destructive" : ""}`}>{optimisticLike.likeCount}</span>
      <Button variant="ghost" size="icon">
        <MessageCircleIcon className="h-5 w-5 text-muted-foreground" />
      </Button>
      <span className="-ml-1">{commentNumber}</span>
      <Button variant="ghost" size="icon">
        <Share2Icon className="h-5 w-5 text-muted-foreground" />
      </Button>
    </div>
  )
}

export default PostInteraction
