'use client'
export const revalidate = 0
import Link from "next/link";
import Card from "./Card";
import { useSupabase } from "../supabase-provider";
import { state } from "../state/State";
import { useRouter } from 'next/navigation'
import { useSnapshot } from "valtio";
import { FriendsIcon, HomeIcon, LogoutIcon, ProfileIcon } from "../icons/icons";

export default function NavigationCard(){

  const linkClass= 'text-sm md:text-md flex gap-1 md:gap-3 py-2 my-2 md:-mx-4 px-6 md:px-4 rounded-md transition-all duration-300 hover:text-bloodRed items-center';
  const snap = useSnapshot(state);
  const router = useRouter();
  const { supabase } = useSupabase();

  async function logout() {         // Logout and redirect to the login page
    await supabase.auth.signOut();
    console.log("Logged out")
    router.refresh();
    router.replace('/login')
    state.authorized = null;
    router.refresh();
    router.replace('/login')
  }
  
  return (
    <Card padding={false}>
      <div className="px-4 py-2 flex justify-between md:block shadow-md shadow-gray-500 md:shadow-none overflow-hidden">
        <Link href="/" className={linkClass}>
          <HomeIcon />
          <span className="hidden md:block">Home</span>
        </Link>
        <Link href={`/profile/${snap.userID}`} className={linkClass}>
          <ProfileIcon />
          <span className="hidden md:block">Profile</span>
        </Link>
        <Link href={`/profile/${snap.userID}/friends`} className={linkClass}>
          <FriendsIcon />
          <span className="hidden md:block">Followed</span>
        </Link>
        <button onClick={logout} className={linkClass}>
          <LogoutIcon />
          <span className="hidden md:block">Logout</span>
        </button>
      </div>
    </Card>
  );
}
