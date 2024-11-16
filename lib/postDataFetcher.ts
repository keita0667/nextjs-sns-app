import prisma from "@/lib/prisma";

export async function fetchPosts(
  loginUserId: string,
  displayUserId?: string,
) {

  if (displayUserId) {
    return await prisma.post.findMany({
      where: {
        authorId: displayUserId
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

  const following = await prisma.follow.findMany({
    where: {
      followingId: loginUserId
    },
    select: {
      followerId: true
    }
  })

  const followingIds = following.map((row) => row.followerId)

  return await prisma.post.findMany({
    where: {
      authorId: {
        in: [...followingIds, loginUserId]
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
