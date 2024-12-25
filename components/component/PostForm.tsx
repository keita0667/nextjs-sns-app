'use client';

import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { addPostAction, getUserData } from '@/lib/actions';
import SubmitButton from './SubmitButton';
import { useFormState } from 'react-dom';
import classNames from 'classnames';
import { useAuth } from '@clerk/nextjs';
import { User } from '@prisma/client';

export default function PostForm() {
  const initialState = {
    error: undefined,
    success: false,
  };

  const formRef = useRef<HTMLFormElement>(null);

  const [state, formAction] = useFormState(addPostAction, initialState);
  const [count, setCount] = useState<number>(0);
  const [userData, setUserData] = useState<User | null>(null);
  const { userId: loginUserId } = useAuth();
  const [filePreviews, setFilePreviews] = useState<string[]>([]);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setCount(e.currentTarget.value.length);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    console.log('files', files);
    if (files) {
      // ファイルをプレビューするためにURLを生成
      const previews = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      );
      setFilePreviews(previews);
      console.log(previews, 99);
    }
  };

  // フォーム送信後のリセット処理
  useEffect(() => {
    if (state.success && formRef.current) {
      formRef.current.reset();
      setCount(0);
    }
  }, [state.success]);

  // データ取得を useEffect で処理
  useEffect(() => {
    async function fetchUserData() {
      if (loginUserId) {
        const userData = await getUserData(loginUserId);
        setUserData(userData);
      }
    }
    fetchUserData();
  }, [loginUserId]);

  return (
    <div>
      <div className="flex gap-4">
        <Avatar className="w-10 h-10">
          <AvatarImage
            src={
              userData && userData.image
                ? userData.image
                : '/placeholder-user.jpg'
            }
          />
          <AvatarFallback>AC</AvatarFallback>
        </Avatar>
        <form
          ref={formRef}
          action={formAction}
          className="flex items-center flex-1"
          encType="multipart/form-data"
        >
          <div className="flex flex-col w-full">
            <textarea
              placeholder="What's on your mind?"
              className="flex-1 rounded-lg bg-muted px-4 py-2 h-20 align-top break-words whitespace-normal"
              name="postText"
              onChange={(e) => handleChange(e)}
            />
            <input
              type="file"
              name="postFile"
              accept=".jpg,.png,.pdf"
              onChange={(e) => handleFileChange(e)}
            />
            {/* プレビューの表示 */}
            <div className="mt-4 flex flex-wrap gap-2">
              {filePreviews.map((preview, index) => (
                <img
                  key={index}
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="w-24 h-24 object-cover rounded-lg"
                />
              ))}
            </div>
          </div>
          <SubmitButton />
        </form>
      </div>
      <span
        className={classNames({
          'text-destructive': count >= 140,
          'block text-right mt-2 pr-12': true,
        })}
      >
        文字数：{count}/140
      </span>
      {state.error && (
        <p className="text-destructive mt-1 ml-14">{state.error}</p>
      )}
    </div>
  );
}
