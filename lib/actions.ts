"use server";

import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import prisma from "./prisma";
import { revalidatePath, revalidateTag } from "next/cache";

type State = {
  error?: string;
  success: boolean,
}

export async function addPostAction(prevState: State, formData: FormData): Promise<State> {
  try {
    const { userId } = auth()
    if (!userId) {
      return {
        error: "ログインしてください。",
        success: false,
      }
    }
    const postText = formData.get("post") as string
    const postTextSchema = z
      .string()
      .min(1, "ポスト内容を入力してください。")
      .max(140, "140文字以内で入力してください。")

    const validatePostText = postTextSchema.parse(postText)
    await prisma.post.create({
      data: {
        content: validatePostText,
        authorId: userId,
      }
    })

    revalidateTag("post") // 投稿時に即画面に反映

    return {
      error: undefined,
      success: true,
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        error: error.errors.map((e) => e.message).join(', '),
        success: false,
      }
    } else if (error instanceof Error) {
      return {
        error: error.message,
        success: false,
      }
    } else {
      return {
        error: "予期せぬエラーが発生しました。",
        success: false,
      }
    }
  }
}

export const likeAction = async(postId: string) => {
  "user server"

  const { userId } = auth();

  if (!userId) {
    throw new Error("User is not authenticated")
  }

  try {
    const existingLike = await prisma.like.findFirst({
      where: {
        postId,
        userId,
      },
    })

    if (existingLike) {
      await prisma.like.delete({
        where: {
          id: existingLike.id
        }
      })
    } else {
      await prisma.like.create({
        data: {
          postId,
          userId,
        },
      })
    }
    revalidatePath("/")
  } catch(err) {
    console.log(err)
  }
}

export async function followUser(
  profileUserId: string
) {
  "use server"

  const { userId: loginUserId } = auth();

  if (!loginUserId) {
    throw new Error("User is not authenticated")
  }

  try {
    const existingFollow = await prisma.follow.findFirst({
      where: {
        followingId: loginUserId,
        followerId: profileUserId,
      },
    })

    if (existingFollow) {
      await prisma.follow.delete({
        where: {
          followerId_followingId: {
            followingId: loginUserId,
            followerId: profileUserId,
          }
        }
      })
    } else {
      await prisma.follow.create({
        data: {
          followingId: loginUserId,
          followerId: profileUserId,
        },
      })
    }
    revalidatePath(`/profile/${profileUserId}`)
  } catch(err) {
    console.log(err)
  }
}
