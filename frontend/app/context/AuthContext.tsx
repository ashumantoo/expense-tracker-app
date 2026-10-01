'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { getCookie } from 'cookies-next/client'

const AuthContext = createContext({ user: { email: "" }, loading: true })

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{ email: string }>({ email: "" })
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    async function checkAuth() {
      try {
        const token = getCookie('auth_token') as string
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/users/me`, {
          method: "GET",
          headers: {
            'Authorization': `Bearer ${token}`,
            "Content-type": "application/json"
          },
        }
        )
        if (res.ok) {
          const data = await res.json()
          setUser({
            email: data.user?.email as string
          })
        } else {
          setUser({ email: "" })
          if (['/dashboard', '/profile'].some(route => pathname.startsWith(route))) {
            router.push('/login')
          }
        }
      } catch {
        setUser({ email: "" })
      } finally {
        setLoading(false)
      }
    }
    checkAuth()
  }, [pathname, router])

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)