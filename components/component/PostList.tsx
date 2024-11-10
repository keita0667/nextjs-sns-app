import { fetchPosts } from "@/lib/postDataFetcher";
import { auth } from "@clerk/nextjs/server";
import Post from "./Post";

export default async function PostList() {

  const { userId } = auth()

  const posts = await fetchPosts(userId)

  return (
    <div className="space-y-4">
      {posts ? (
        posts.map((post) => (
          <Post key={post.id} post={post}/>))
        ) : (
        <div>ポストが見つかりません。</div>
      )}
    </div>
  );
}
