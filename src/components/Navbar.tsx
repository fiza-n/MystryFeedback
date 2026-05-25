'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { User } from 'next-auth'
import { Menu, X, LogOut, Send } from 'lucide-react'

const Navbar = () => {
  const { data: session } = useSession()
  const user: User = session?.user
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => setIsOpen(!isOpen)

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-border backdrop-blur-sm bg-opacity-95 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center group-hover:shadow-lg group-hover:shadow-primary/30 transition-all duration-300">
              <Send className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground hidden sm:inline-block">
              Mystery Messages
            </span>
            <span className="text-xl font-bold text-foreground sm:hidden">MM</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            {session ? (
              <>
                <div className="flex items-center gap-3 px-4 py-2 bg-muted rounded-lg border border-border hover:border-muted-foreground/30 transition-colors">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-white">
                      {user?.username?.[0]?.toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {user?.username}
                  </span>
                </div>

                <button
                  onClick={() => signOut({ redirect: true, callbackUrl: '/sign-in' })}
                  className="flex items-center gap-2 px-4 py-2 bg-destructive/90 hover:bg-destructive text-white font-medium rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-destructive/20"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : (
              <Link href="/sign-in">
                <button className="px-6 py-2 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-primary/30">
                  Sign In
                </button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors text-foreground"
          >
            {isOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t border-border">
            <div className="flex flex-col gap-3 mt-4">
              {session ? (
                <>
                  <div className="flex items-center gap-3 px-4 py-3 bg-muted rounded-lg border border-border">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-white">
                        {user?.username?.[0]?.toUpperCase()}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      {user?.username}
                    </span>
                  </div>

                  <Link href="/dashboard" className="w-full">
                    <button className="w-full px-4 py-2 bg-muted hover:bg-muted/80 text-foreground font-medium rounded-lg transition-colors text-left">
                      Dashboard
                    </button>
                  </Link>

                  <button
                    onClick={() => {
                      signOut({ redirect: true, callbackUrl: '/sign-in' })
                      setIsOpen(false)
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 bg-destructive/90 hover:bg-destructive text-white font-medium rounded-lg transition-all duration-200"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </>
              ) : (
                <Link href="/sign-in" className="w-full">
                  <button className="w-full px-4 py-2 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg transition-all duration-200">
                    Sign In
                  </button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar