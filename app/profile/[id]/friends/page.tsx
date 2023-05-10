'use client'
export const revalidate = 0
import Layout from "@/app/components/Layout";
import { state } from "@/app/state/State";
import { useSnapshot } from "valtio";
import Card from "@/app/components/Card";
import { useEffect, useState } from "react";
import { useSupabase } from "@/app/supabase-provider";
import FriendCard from "@/app/components/FriendCard";
import { useRouter } from "next/navigation";

export default function friends({ params }: any) {

    const snap = useSnapshot(state);
    console.log(params);
    const isMyProfile = params.id === snap.userID;
    const router = useRouter();
    if (!isMyProfile) {
        router.replace('/')
    }
    const { supabase } = useSupabase();
    const [followedUsers, setFollowedUsers] = useState([]);
    const [loading, setLoading] = useState<boolean>(false);

    type FollowedUser = {
        profiles: {
          name: string;
          avatar: string;
          id: string;
        };
    }

    const fetchFollowedUsers = () => {
        setLoading(true);
        supabase.from('followed_users')
            .select('user_id, profiles(id, avatar, name)')
            .eq('user_id', snap.userID)
            .then(result => {
                console.log('results of followers: ')
                console.log(result);
                setFollowedUsers(result.data);
                setLoading(false);
            })
    }

    useEffect(() => {
        fetchFollowedUsers();
    }, [snap.userID]);

    const handleUnfollow = (followedUserID: string) => {

        supabase.from('followed_users')
            .delete()
            .eq('user_id', snap.userID)
            .eq('user_to_follow', followedUserID)
            .then(result => {
                console.log(result);
                fetchFollowedUsers();
            })
    }    

    return (
        <Layout>
            <Card>
                {
                    isMyProfile && loading &&
                    <h4>Loading.</h4>
                }
                {
                    isMyProfile && followedUsers.length < 1 && !loading &&
                    <h4>You don't follow anyone.</h4>
                }

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'auto auto',
                    columnGap: '10px',
                    rowGap: '40px',
                    justifyItems: 'center',
                    margin: '0 auto',
                }}>
                    {
                        isMyProfile && followedUsers &&
                        followedUsers.map((followedUser:FollowedUser, index) => (
                            <FriendCard 
                                name={followedUser.profiles.name}
                                avatar={followedUser.profiles.avatar}
                                id={followedUser.profiles.id}
                                key={index}
                                unfollow={handleUnfollow}
                            />
                        ))
                    }
                </div>
            </Card>
        </Layout>
    );
}
