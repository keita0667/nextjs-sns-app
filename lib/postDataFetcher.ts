import prisma from "@/lib/prisma";

export async function fetchPosts(userId: string | null) {

  if (!userId) return;

  return await prisma.post.findMany({
    where: {
      authorId: {
        in: [userId],
      }
    },
    include: {
      author: true,
      likes: {
        select: {
          userId: true,
        }
      },
      _count: {
        select: {
          replies: true,
        }
      }
    },
    orderBy: {
      createdAt: "desc",
    }
  })
}
