import prisma from '@/lib/prisma';

export async function fetchPosts(params: {
  loginUserId: string;
  displayUserId?: string;
  searchQuery?: string;
}) {
  if (params.displayUserId) {
    return await prisma.post.findMany({
      where: {
        authorId: params.displayUserId,
      },
      include: {
        author: true,
        likes: {
          select: {
            userId: true,
          },
        },
        _count: {
          select: {
            replies: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  const following = await prisma.follow.findMany({
    where: {
      followingId: params.loginUserId,
    },
    select: {
      followerId: true,
    },
  });

  const followingIds = following.map((row) => row.followerId);

  return await prisma.post.findMany({
    where: {
      authorId: {
        in: [...followingIds, params.loginUserId],
      },
      content: {
        contains: params.searchQuery,
      },
    },
    include: {
      author: true,
      likes: {
        select: {
          userId: true,
        },
      },
      _count: {
        select: {
          replies: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}
