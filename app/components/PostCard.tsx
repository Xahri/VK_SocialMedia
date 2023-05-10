'use client'
export const revalidate = 0
import ReactTimeAgo from "react-time-ago";
import Avatar from "./Avatar";
import Card from "./Card";
import Link from "next/link";
import { useSupabase } from "../supabase-provider";
import { state } from "../state/State";
import { useSnapshot } from "valtio";
import { useEffect, useState } from "react";

type PostCardProps = {
  id: string;
  content: string;
  created_at?: string;
  profiles: any;
  photo?: string;
};

export default function PostCard({ id, content, created_at, photo, profiles:profile }: PostCardProps) {
  const [likes, setLikes] = useState([]);
  const snap = useSnapshot(state);
  const { supabase } = useSupabase();

  useEffect(() => {
    fetchLikes();
  },[])

  const fetchLikes = () => {
    supabase.from('likes')
      .select()
      .eq('post_id', id)
      .then(result => {
        setLikes(result.data)
      })
  }

  const isLikedByMe = !!likes.find(like => like.user_id === snap.userID); // Bool.
  const toggleLike = () => {
    if (isLikedByMe) {        // Unlike if already liked.
      supabase.from('likes')
        .delete()
        .eq('post_id', id)
        .eq('user_id', snap.userID)
        .then(result => {
          console.log(result);
          fetchLikes();
        })

      return;
    }
    // If not liked, then like.
    supabase.from('likes')
      .insert({
        post_id: id,
        user_id: snap.userID
      })
      .then(result => {
        console.log(result);
        fetchLikes();
      })
  }

  return (
    <Card>
      <div className="flex gap-3">
        <div>
          <Link href={'/profile/' + profile.id}>
            <span className="cursor-pointer">
              <Avatar url={profile.avatar} />
            </span>
          </Link>
        </div>
        <div className="grow">
          <p>
            <Link href={'/profile/' + profile.id}>
              <span className="mr-1 font-semibold cursor-pointer hover:underline">
                {profile.name}
              </span>
            </Link>
            shared a post
          </p>
          <p className="text-gray-400 text-sm">
            <ReactTimeAgo date={Date.parse(created_at)} />
          </p>
        </div>
      </div>
      <div>
        <p className="my-3 text-sm">{content}</p>
        {photo && (
          <div>
            <img src={photo} className="rounded-md" alt=""/>
          </div>
        )}
      </div>
      <div className="mt-5 flex gap-8 stroke-bloodRed">
        <button className="flex gap-2 items-center" onClick={toggleLike}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="bloodRed" className={`w-6 h-6 ${isLikedByMe && 'fill-bloodRed'}`}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
          {likes?.length}
        </button>
      </div>
    </Card>
  );
}
