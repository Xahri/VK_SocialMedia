'use client'
export const revalidate = 0
import Avatar from "./Avatar";
import Link from "next/link";

type FriendCardProps = {
  name: string;
  avatar: string;
  id: string;
  unfollow: (id: string) => void;
};

export default function FriendCard({ name, avatar, id, unfollow }: FriendCardProps) {

  return (
    <div className="flex gap-2 items-center content-center">
      <Link href={'/profile/' + id}>
        <span className="cursor-pointer">
          <Avatar size="w-8 h-8" url={avatar} />
        </span>
      </Link>
      <div>
        <Link href={'/profile/' + id}>
          <span className="mr-1 font-semibold cursor-pointer hover:underline">
            {name}
          </span>
        </Link>
        <div className="text-sm leading-3">{'Status'}</div>
      </div>

      <button 
          className={`border-[1px] hover:bg-bloodRed transition-all duration-200 border-bloodRed text-white px-4 py-1 rounded text-sm`}
          onClick={() => unfollow(id)}
      >
        Unfollow
      </button>
    </div>
  );
}
