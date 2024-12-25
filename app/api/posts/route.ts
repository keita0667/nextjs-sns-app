import { fetchPosts } from '@/lib/postDataFetcher';
import { NextApiResponse } from 'next';
import { NextResponse } from 'next/server';

type PostParams = {
  loginUserId: string;
  displayUserId?: string;
  searchQuery?: string;
};

export async function GET(req: Request) {
  console.info('PostのGETメソッドが実行されます。');

  const { searchParams } = new URL(req.url);

  const params: PostParams = {
    loginUserId: searchParams.get('loginUserId') || '',
    displayUserId: searchParams.get('displayUserId') || undefined,
    searchQuery: searchParams.get('searchQuery') || undefined,
  };

  const posts = await fetchPosts(params);

  return NextResponse.json(posts);
}
