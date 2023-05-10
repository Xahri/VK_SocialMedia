'use client'
export const revalidate = 0
import Card from "./Card";
import Avatar from "./Avatar";
import { useEffect, useState } from "react";
import { useSupabase } from "../supabase-provider";
import { state } from "../state/State";
import { useSnapshot } from "valtio";
import { GridLoader } from "react-spinners";
import { PhotoIcon } from "../icons/icons";

type PostFormCardProps = {
  onPost: () => void;
};

export default function PostFormCard({ onPost }: PostFormCardProps) {
  const { supabase } = useSupabase();
  const snap = useSnapshot(state);
  const [profile, setProfile] = useState({});
  const [content, setContent] = useState();
  const [uploadedImg, setUploadedImg] = useState(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  useEffect(() => {
    supabase.from('profiles')
      .select()
      .eq('id', snap.userID)
      .then(result => {
        if (result.data.length) {
          setProfile(result.data[0]);
        }
      })
  },[])

  const handleCreatePost = () => {
    if (!content) return;
    supabase.from('posts').insert({
      author: snap.userID, // This is handled in RLS
      content: content,
      photo: uploadedImg,
    }).then(response => {
      if (!response.error) {
        setContent('');
        setUploadedImg(null);
        if (onPost) onPost();
      }
    })
  }

  type AddPhotoHandler = (e: React.ChangeEvent<HTMLInputElement>) => void;
  const addPhoto: AddPhotoHandler = (e) => {
    const file = e.target.files?.[0];
    const newName = `${Date.now()}${file?.name}${file?.lastModified}${file?.type}`; // Unique
    supabase.storage.from('photos')
      .upload(newName, file)
      .then(result => {
        if (result.data) {
          const url = process.env.NEXT_PUBLIC_SUPABASE_URL + '/storage/v1/object/public/photos/' + result.data.path;
          setUploadedImg(url);
          setIsUploading(false);
        }
    })
    if (file) setIsUploading(true);
  }

  return (
    <Card>
      <div className="flex gap-2">
        <div> <Avatar url={profile?.avatar} /> </div>
        { profile.name && (
            <textarea className="grow p-3 h-16 bg-[#363636] rounded"
              placeholder={`What's on your mind, ${profile?.name}?`}
              value={content}
              onChange={e => {setContent(e.target.value)}}
            />
          )
        }
      </div>
      {isUploading && (<div className="mt-4"> <GridLoader speedMultiplier={1} color="#fc454b" /> </div>)}
      {uploadedImg && (
        <div className="mt-4"> <img src={uploadedImg} alt="" className="w-auto h-24 rounded-md" /> </div>
      )}
      <div className="flex items-center mt-2">
        <div>
          <label className="flex gap-1 cursor-pointer">
            <input type="file" className="hidden" onChange={addPhoto} />
            <PhotoIcon />
            <span className="hidden md:block">Photos</span>
          </label>
        </div>
        <div className="grow text-right">
          <button
            className="border-[1px] hover:bg-bloodRed transition-all duration-200 border-bloodRed text-white px-6 py-1 rounded "
            onClick={handleCreatePost}
          >
            Post
          </button>
        </div>
      </div>
    </Card>
  );
}
