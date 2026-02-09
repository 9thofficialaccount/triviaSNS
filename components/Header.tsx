'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Search, Bell, User, PenSquare, LogOut, Settings } from 'lucide-react'
import { CreatePostModal } from './CreatePostModal'

export function Header() {
  const { data: session } = useSession()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* ロゴ */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <span className="text-xl font-bold text-gray-900 hidden sm:block">
                トリビアSNS
              </span>
            </Link>

            {/* 検索バー */}
            <div className="flex-1 max-w-xl mx-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="トリビアを検索..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* アクションボタン */}
            <div className="flex items-center space-x-4">
              {session ? (
                <>
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <PenSquare className="w-5 h-5" />
                    <span className="hidden sm:inline">投稿</span>
                  </button>
                  
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <Bell className="w-6 h-6 text-gray-600" />
                  </button>
                  
                  <div className="relative">
                    <button 
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {session.user.displayName.charAt(0)}
                      </div>
                    </button>

                    {/* ユーザーメニュー */}
                    {isUserMenuOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                        <div className="px-4 py-2 border-b border-gray-200">
                          <p className="font-medium text-gray-900">{session.user.displayName}</p>
                          <p className="text-sm text-gray-500">@{session.user.username}</p>
                        </div>
                        {session.user.isAdmin && (
                          <Link
                            href="/admin"
                            className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <Settings className="w-4 h-4" />
                            <span className="text-sm">管理者</span>
                          </Link>
                        )}
                        <button
                          onClick={() => signOut({ callbackUrl: '/login' })}
                          className="w-full flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 transition-colors text-red-600"
                        >
                          <LogOut className="w-4 h-4" />
                          <span className="text-sm">ログアウト</span>
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link href="/login" className="btn-secondary">
                    ログイン
                  </Link>
                  <Link href="/register" className="btn-primary">
                    新規登録
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {session && (
        <CreatePostModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </>
  )
}
