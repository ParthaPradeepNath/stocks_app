import Header from '@/components/Header'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import React from 'react'
import {getAuth} from "@/lib/better-auth/auth";

const Layout = async ({ children }: {children : React.ReactNode}) => {
  let session = null;
  try {
    const auth = await getAuth();
    session = await auth.api.getSession({
      headers: await headers()
    })
  } catch (e) {
    // Database unreachable — fall through to the sign-in redirect below.
    console.error("Failed to get session in (root) layout:", e);
  }

  if(!session?.user) redirect('/sign-in')

    const user = {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
    }
  return (
    <main className="min-h-screen text-gray-400">
        {/* Header */}
        <Header 
        user={user}
        />
        <div className="container py-10">
            {children}
        </div>
    </main>
  )
}

export default Layout