"use client";

import { useAuth } from "@/app/context/AuthContext";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter()
  const { user, loading } = useAuth()


  const isLoginActive = pathname === "/login";
  const isSignupActive = pathname === "/signup";

  const logout = async () => {
    const apiResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/users/logout`, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      credentials: "include" // <--Tells the browser to accept and save the incoming cookie
    })

    const data = await apiResponse.json()
    if (data.success) {
      router.push('/login')
    } else {
      alert(data.message)
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-sm transition-transform duration-200 group-hover:scale-105">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 2v20M17 5.5c-1-1-2.5-1.5-5-1.5s-4 1-4 3 2 3 5 3 5 1 5 3-2 3-5 3-4-.5-5-1.5"
              />
            </svg>
          </div>

          <span className="text-lg font-bold tracking-tight text-slate-900">
            Expense<span className="text-indigo-600">Tracker</span>
          </span>
        </Link>

        {/* Authentication Actions */}
        <div className="flex items-center gap-3">
          {/* Login */}
          {!loading && (
            <>
              {user && user.email ? (
                <>
                  <span className="text-indigo-700">Welcome, {user.email || 'User'}</span>

                  <Link
                    href=""
                    onClick={logout}
                    className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${isSignupActive
                      ? "bg-indigo-700 text-white shadow-md"
                      : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                      }`}
                  >
                    Logout
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${isLoginActive
                      ? "bg-indigo-700 text-white shadow-md"
                      : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                      }`}
                  >
                    Login
                  </Link>

                  {/* Sign Up */}
                  <Link
                    href="/signup"
                    className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${isSignupActive
                      ? "bg-indigo-700 text-white shadow-md"
                      : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                      }`}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}