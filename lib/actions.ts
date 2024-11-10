"use server";

import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import prisma from "./prisma";

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
