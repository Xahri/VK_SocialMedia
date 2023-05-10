'use client'
export const revalidate = 0
import Card from "../components/Card";
import { useSupabase } from "../supabase-provider";

export default function LoginPage() {

    const btnStyle = 'flex w-full gap-4 items-center justify-center p-4 text-[#969696] hover:text-bloodRed transition-all duration-300 hover:scale-[1.02]';
    const {supabase} = useSupabase();
    async function loginGoogle() {
        await supabase.auth.signInWithOAuth({
            provider: 'google',
        });
    }
  
    return (
        <div className="w-screen h-screen flex items-center">
            <div className="max-w-xs mx-auto grow">
                <h1 className="text-6xl mb-4 text-gray-300 text-center">Login</h1>
                <Card padding={false}>
                    <div className="rounded-md overflow-hidden p-4 flex-col gap-12">
                        <button className={btnStyle} onClick={loginGoogle}>
                            <svg className="h-6 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"/></svg>
                            Login with Google
                        </button>
                    </div>
                </Card>
            </div>
        </div>
    );
}
