'use client'
export const revalidate = 0
import { useEffect, useState } from "react";
import Layout from "./components/Layout"
import PostCard from "./components/PostCard"
import PostFormCard from "./components/PostFormCard"
import { useSupabase } from "./supabase-provider";
import { state } from "./state/State";
import { useSnapshot } from "valtio";
import FeedTabs from "./components/FeedTabs";

export default function Home() {

  // if (window.location.hash.includes('#access_token=')) { // Just in case :)
  //   window.history.replaceState({}, document.title, window.location.pathname);
  // }

  const { supabase } = useSupabase();
  const [posts, setPosts] = useState([]);
  const [followedUsers, setFollowedUsers] = useState([]);
  const snap = useSnapshot(state);
  const [followedUsersPosts, setFollowedUsersPosts] = useState([]);

  useEffect(() => {
    console.log(supabase)
    fetchPosts();
  },[])

  const fetchPosts = () => {
    supabase.from('posts').select('id, content, created_at, photo, profiles(id, avatar, name)')
      .order('created_at', {ascending: false}) // Show new posts on top
      .then(result => {
        setPosts(result.data);
    })
  }

  const fetchFollowedUsers = () => {
    supabase.from('followed_users')
        .select('user_id, profiles(id, avatar, name)')
        .eq('user_id', snap.userID)
        .then(result => {
            setFollowedUsers(result.data);
        })
  }

  useEffect(() => {
      fetchFollowedUsers();
  }, [snap.userID]);

  interface Post {
    id: string;
    title: string;
    content: string;
    profiles: {
      id: string;
      name: string;
    };
  }

  const getFollowedUsersPosts = () => {
    const followedUsersPostsArr: any = [];
    posts.filter((post: Post) => {
      const searchId: string = post.profiles.id
      const result = followedUsers.find(profiles => {
        return Object.values(profiles).some((innerObj: any) => innerObj.id === searchId);
      });
  
      if (result) {
        followedUsersPostsArr.push(post)
      }
    })
    return followedUsersPostsArr;
  }

  useEffect(() => {
    const arr = getFollowedUsersPosts();
    if (arr) setFollowedUsersPosts(arr);
  }, [posts, followedUsers]);


  return (
    <Layout>
      <PostFormCard onPost={fetchPosts}/>
      <FeedTabs />
      {
        snap.globalActive ?
          posts.map((post: Post) => (
            <PostCard {...post} key={post.id} />
          ))
        :
          followedUsersPosts.map((post: Post)  => (
            <PostCard {...post} key={post.id} />
          ))
      }
    </Layout>
  )
}
