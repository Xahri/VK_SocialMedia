'use client'
export const revalidate = 0
import { useSupabase } from "../supabase-provider";
import { state } from "../state/State";
import { useSnapshot } from "valtio";
import { useState } from "react";
import { GridLoader } from "react-spinners";
import { CameraIcon } from "../icons/icons";


type AvatarProps = {
  size?: string;
  url: string;
  editable?: boolean;
  onChange?: () => void;
};

export default function Avatar({ size = 'w-12 h-12', url, editable, onChange }: AvatarProps) {

  const snap = useSnapshot(state)
  const { supabase } = useSupabase();
  const [isUploading, setIsUploading] = useState(false);

  type UpdateAvatarHandler = (e: React.ChangeEvent<HTMLInputElement>) => void;
  const handleUpdateAvatar: UpdateAvatarHandler = (e) => {
    const file = e.target.files?.[0];
    const newName = `${Date.now()}${file?.name}${file?.lastModified}${file?.type}`; // Unique
    if (file) {
      setIsUploading(true);
      supabase.storage.from('avatars')
        .upload(newName, file)
        .then(result => {
          if (result.data) {
            const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${result.data.path}`;
            supabase.from('profiles')
              .update({
                avatar: url,
              })
              .eq('id', snap.userID)
              .then(result => {
                if (!result.error) {
                  console.log(result);
                } else {
                  throw result.error;
                }
              });
          }
          setIsUploading(false);
          if (onChange) onChange();
      })
    }
  }

  return (
    <div>
      <div className={`${size} rounded-full overflow-hidden m-auto ${isUploading && 'hidden'}`}>
        <img className="w-full h-full object-cover object-center" src={url} alt="" />
      </div>

      {
        isUploading &&
          <div className="text-center">
            <GridLoader speedMultiplier={1} color="#fc454b" />
          </div>
      }

      {editable && (
        <label className="absolute bottom-0 right-0 shadow-md p-2 bg-bloodRed rounded-full cursor-pointer">
          <input type="file" className="hidden" onChange={handleUpdateAvatar}/>
          <CameraIcon />
        </label>
      )}
    </div>
  );
}
