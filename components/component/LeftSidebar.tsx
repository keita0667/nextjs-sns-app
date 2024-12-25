// components/LeftSidebar.tsx
import Link from 'next/link';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  HomeIcon,
  CompassIcon,
  BookmarkIcon,
  UserIcon,
  MessageCircleIcon,
  HeartIcon,
  SettingsIcon,
} from './Icons';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

const navItems = [
  { icon: HomeIcon, label: 'Home', href: '/' },
  { icon: CompassIcon, label: 'Explore', href: '/explore' },
  { icon: BookmarkIcon, label: 'Bookmarks', href: '/bookmarks' },
  { icon: UserIcon, label: 'Profile', href: '/profile' },
  { icon: MessageCircleIcon, label: 'Messages', href: '/messages' },
  { icon: HeartIcon, label: 'Likes', href: '/likes' },
];

export default async function LeftSidebar() {
  let userInfo;
  const { userId: loginUserId } = auth();

  if (!loginUserId) {
    userInfo = null;
  } else {
    userInfo = await prisma.user.findFirst({
      where: {
        id: loginUserId,
      },
    });
  }

  return (
    <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg shadow-md p-4 h-full flex flex-col">
      <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
        <Avatar className="w-12 h-12">
          <Link href={`profile/${userInfo?.username ?? ''}`}>
            <AvatarImage src={userInfo?.image ?? './placeholder-user.jpg'} />
          </Link>
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        <div className="">
          <h3 className="truncate max-w-xs text-lg font-bold">
            {userInfo?.username ?? 'Avatar'}
          </h3>
          <p className="truncate max-w-28 text-sm text-gray-600 dark:text-gray-400">
            @{userInfo?.id}
          </p>
        </div>
      </div>
      <nav className="flex-grow">
        <ul className="space-y-2">
          {navItems.map(({ icon: Icon, label, href }) => (
            <li key={label}>
              <Link href={href} className="block">
                <div className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-muted dark:hover:bg-gray-700 transition-colors">
                  <Icon className="h-5 w-5" />
                  <span>{label}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
        <Link href="/settings" className="block">
          <div className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <SettingsIcon className="h-5 w-5" />
            <span>Settings</span>
          </div>
        </Link>
      </div>
    </div>
  );
}
