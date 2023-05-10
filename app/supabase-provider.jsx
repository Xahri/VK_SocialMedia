'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'

import { state } from './state/State'
import { useSnapshot } from "valtio";
import LoginPage from './login/page'

import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en.json'
import ru from 'javascript-time-ago/locale/ru.json'
TimeAgo.addDefaultLocale(en)
TimeAgo.addLocale(ru)

const Context = createContext(undefined)

export default function SupabaseProvider({ children }) {
  
  const [supabase] = useState(() => createBrowserSupabaseClient())
  const router = useRouter()

  const snap = useSnapshot(state);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      const session = supabase.auth.getUser();
      session.then(response => {
        const {data, error} = response;
        console.log({data, error});
        if (response.data.user === null) router.push('/login')
        state.authorized = response.data.user
        if (response.data.user !== null) {
          state.userID = response.data.user.id
        }
      });

    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router, supabase])

  return (
    <Context.Provider value={{ supabase }}>
      {snap.authorized === 'loading' ? <h1>Loading</h1> : snap.authorized === null ? <LoginPage /> : <>{children}</>}
    </Context.Provider>
  )
}

export const useSupabase = () => {
  const context = useContext(Context)

  if (context === undefined) {
    throw new Error('useSupabase must be used inside SupabaseProvider')
  }

  return context
}
