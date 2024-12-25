import { fetchPosts } from '@/lib/postDataFetcher';
import { auth } from '@clerk/nextjs/server';
import Post from './Post';

export default async function PostList(props: {
  displayUserId?: string;
  searchParams?: { [key: string]: string | undefined };
}) {
  const { userId: loginUserId } = auth();

  const posts = loginUserId
    ? await fetchPosts({
        loginUserId,
        displayUserId: props.displayUserId,
        searchQuery: props.searchParams
          ? Object.values(props.searchParams)[0]
          : undefined,
      })
    : [];

  console.log('searchParams', props.searchParams);

  return (
    <div className="space-y-4">
      {posts?.length ? (
        posts.map((post) => <Post key={post.id} post={post} />)
      ) : (
        <div>ポストが見つかりません。</div>
      )}
    </div>
  );
}
