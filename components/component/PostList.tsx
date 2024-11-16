import { fetchPosts } from "@/lib/postDataFetcher";
import { auth } from "@clerk/nextjs/server";
import Post from "./Post";

export default async function PostList(
  props: {
    displayUserId?: string
  }
) {

  const { userId: loginUserId } = auth()

  const posts = loginUserId ? await fetchPosts(loginUserId, props.displayUserId) : []

  return (
    <div className="space-y-4">
      {posts?.length ? (
        posts.map((post) => (
          <Post key={post.id} post={post}/>))
        ) : (
        <div>ポストが見つかりません。</div>
      )}
    </div>
  );
}
