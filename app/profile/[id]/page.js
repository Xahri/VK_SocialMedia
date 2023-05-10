'use client'
export const revalidate = 0
import Layout from "@/app/components/Layout";
import Card from "@/app/components/Card";
import Avatar from "@/app/components/Avatar";
import PostFormCard from "@/app/components/PostFormCard";
import PostCard from "@/app/components/PostCard";
import { useEffect, useState } from "react";
import { useSupabase } from "@/app/supabase-provider";
import { state } from "@/app/state/State";
import { useSnapshot } from "valtio";

export default function Page({ params }) {

    const [profile, setProfile] = useState(null)
    const [editMode, setEditMode] = useState(false);
    const [profileName, setProfileName] = useState('');
    const [profileCity, setProfileCity] = useState('');
    const [profileUniversity, setProfileUniversity] = useState('');
    const [profileBirthday, setProfileBirthday] = useState('');
    const [posts, setPosts] = useState([]);
    const [isFollowing, setIsFollowing] = useState(false);
    const [followedUsers, setFollowedUsers] = useState([]);
    const { supabase } = useSupabase();
    const snap = useSnapshot(state);
    const isMyProfile = params.id === snap.userID;

    useEffect(() => {
        fetchUser();
    },[])

    const fetchUser = () => {       // Get the current user.
        supabase.from('profiles')
        .select()
        .eq('id', params.id)
        .then(result => {
            if (result.error) throw result.error;
            if (result.data) setProfile(result.data[0])
        })
    }

    const saveProfile = () => {     // Save profile details.
        if (!profileName || !profileCity || !profileUniversity || !profileBirthday) {
            setEditMode(false);
            alert('You left some field empty.')
            return;
        }
        supabase.from('profiles')
            .update({
                name: profileName,
                city: profileCity,
                university: profileUniversity,
                birthday: profileBirthday,
            })
            .eq('id', snap.userID)
            .then(result => {
                if (!result.error) {
                    setProfile(prev => ({...prev, name: profileName, city: profileCity, university: profileUniversity, birthday: profileBirthday}))
                }
                setEditMode(false);
            })
    }

    useEffect(() => {           // Get the posts of that specific user.
        if (!params.id) return;
        supabase.from('posts')
        .select('id, content, created_at, author, photo, profiles(id, avatar, name)')
        .eq('author', params.id)
        .order('created_at', {ascending: false})
        .then(result => {
            setPosts(result.data);
        })
    },[params.id])

    const fetchFollowedUsers = () => {          // Get my followed users.
        if (params.id !== snap.userID) return;
        supabase.from('followed_users')
            .select('user_id, profiles(id, avatar, name)')
            .eq('user_id', snap.userID)
            .then(result => {
                setFollowedUsers(result.data);
                const alreadyFollowing = !!(result.data).find(followedUserID => followedUserID.profiles.id === params.id); // Bool
                setIsFollowing(alreadyFollowing);
            })
    }

    useEffect(() => {
        fetchFollowedUsers();
    }, [snap.userID]);

    const toggleFollow = () => {
        if (!isFollowing) { // Follow if you're not following them already.
            setIsFollowing(true);
            supabase.from('followed_users')
            .insert({
                user_id: snap.userID,
                user_to_follow: params.id,
            })
            .then(result => {
                setIsFollowing(true);
            })
        }
        else { // Unfollow if you already follow them.
            setIsFollowing(false);
            supabase.from('followed_users')
                .delete()
                .eq('user_id', snap.userID)
                .eq('user_to_follow', params.id)
                .then(result => {
                    setIsFollowing(false);
                })
        }
        fetchFollowedUsers();
    }

    return (
        <Layout>
            {profile &&
                <>
                    <Card>
                        <div className="relative overflow-hidden rounded-md">
                            <div className="flex">
                                <div className="m-auto z-12 flex flex-col justify-center items-center">
                                    <Avatar size={'w-36 h-36'} url={profile.avatar} editable={isMyProfile} onChange={fetchUser} />
                                    <div className="mt-2 items-center content-center flex flex-col gap-1">
                                        <div className="text-2xl font-bold text-center">
                                            {!editMode && profile.name}
                                            {editMode && (
                                                <div>
                                                    <input 
                                                        className="border border-bloodRed py-2 px-3 rounded-md text-xs font-md text-center bg-[#161616]"
                                                        type="text"
                                                        placeholder="Enter your name"
                                                        value={profileName}
                                                        onChange={e => setProfileName(e.target.value)}
                                                        maxLength={12}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-gray-300 leading-4">
                                            Hello 🙌❤️
                                        </div>

                                        <div className="flex gap-[12px] text-[12px] items-center content-center mt-[12px]">
                                            <div className="text-gray-300 leading-4 flex content-center items-center gap-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.4} stroke="currentColor" className="w-5 h-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                                </svg>
                                                <span >
                                                    {!editMode && (profile.city ? profile.city : 'City')}
                                                    {editMode && (
                                                        <div>
                                                            <input 
                                                                className="border border-bloodRed py-2 px-0 rounded-md text-xs font-md text-center max-w-[72px] bg-[#161616]"
                                                                type="text"
                                                                placeholder="City"
                                                                value={profileCity}
                                                                onChange={e => setProfileCity(e.target.value)}
                                                                maxLength={12}
                                                            />
                                                        </div>
                                                    )}
                                                </span>
                                            </div>

                                            <div className="text-gray-300 leading-4 flex content-center items-center gap-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.4} stroke="currentColor" className="w-5 h-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                                                </svg>
                                                <span >
                                                    {!editMode && (profile.university ? profile.university : 'University')}
                                                    {editMode && (
                                                        <div>
                                                            <input 
                                                                className="border border-bloodRed py-2 px-0 rounded-md text-xs font-md text-center max-w-[72px] bg-[#161616]"
                                                                type="text"
                                                                placeholder="University"
                                                                value={profileUniversity}
                                                                onChange={e => setProfileUniversity(e.target.value)}
                                                                maxLength={8}
                                                            />
                                                        </div>
                                                    )}
                                                </span>
                                            </div>

                                            <div className="text-gray-300 leading-4 flex content-center items-center gap-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.4} stroke="currentColor" className="w-5 h-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.87c1.355 0 2.697.055 4.024.165C17.155 8.51 18 9.473 18 10.608v2.513m-3-4.87v-1.5m-6 1.5v-1.5m12 9.75l-1.5.75a3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0L3 16.5m15-3.38a48.474 48.474 0 00-6-.37c-2.032 0-4.034.125-6 .37m12 0c.39.049.777.102 1.163.16 1.07.16 1.837 1.094 1.837 2.175v5.17c0 .62-.504 1.124-1.125 1.124H4.125A1.125 1.125 0 013 20.625v-5.17c0-1.08.768-2.014 1.837-2.174A47.78 47.78 0 016 13.12M12.265 3.11a.375.375 0 11-.53 0L12 2.845l.265.265zm-3 0a.375.375 0 11-.53 0L9 2.845l.265.265zm6 0a.375.375 0 11-.53 0L15 2.845l.265.265z" />
                                                </svg>
                                                {!editMode && (profile.birthday ? profile.birthday : 'Birthday')}
                                                    {editMode && (
                                                        <div>
                                                            <input 
                                                                className="border border-bloodRed py-2 px-0 rounded-md text-xs font-md text-center max-w-[120px] bg-[#161616]"
                                                                type="date"
                                                                placeholder="Birthday"
                                                                value={profileBirthday}
                                                                onChange={e => setProfileBirthday(e.target.value)}
                                                            />
                                                        </div>
                                                )}
                                            </div>
                                        </div>

                                        {isMyProfile && !editMode && (
                                            <button 
                                                className="border-[1px] hover:bg-bloodRed transition-all duration-200 border-bloodRed text-white px-4 py-1 rounded text-sm "
                                                onClick={() => setEditMode(true)}
                                            >
                                                Edit
                                            </button>
                                        )}

                                        {isMyProfile && editMode && (
                                            <button 
                                                className="border-[1px] hover:bg-bloodRed transition-all duration-200 border-bloodRed text-white px-4 py-1 rounded text-sm "
                                                onClick={saveProfile}
                                            >
                                                Save
                                            </button>
                                        )}

                                        {!isMyProfile && (
                                            <button 
                                                className={`${isFollowing && ('bg-bloodRed')} border-[1px] hover:bg-bloodRed transition-all duration-200 border-bloodRed text-white px-4 py-1 rounded text-sm`}
                                                onClick={toggleFollow}
                                            >
                                                {isFollowing ? 'Unfollow' : "Follow"}
                                            </button>
                                        )}

                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                    { isMyProfile && <PostFormCard /> }
                    {posts.map(post => (
                        <PostCard {...post} key={post.id} />
                    ))}
                </>
            }
        </Layout>
    );
}
