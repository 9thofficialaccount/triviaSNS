'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Header } from '@/components/Header'
import { TriviaPost } from '@/components/TriviaPost'
import { Search, Hash, User } from 'lucide-react'

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const [results, setResults] = useState<any>({ posts: [], tags: [], users: [] })
  const [activeTab, setActiveTab] = useState<'all' | 'posts' | 'tags' | 'users'>('all')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (query) {
      performSearch()
    }
  }, [query, activeTab])

  const performSearch = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&type=${activeTab}`)
      const data = await response.json()
      setResults(data)
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* 検索ヘッダー */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            検索結果
          </h1>
          <p className="text-gray-600">
            「<strong>{query}</strong>」の検索結果
          </p>
        </div>

        {/* タブ */}
        <div className="flex space-x-2 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 font-medium transition-colors border-b-2 ${
              activeTab === 'all'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            すべて
          </button>
          <button
            onClick={() => setActiveTab('posts')}
            className={`px-4 py-2 font-medium transition-colors border-b-2 ${
              activeTab === 'posts'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            投稿
          </button>
          <button
            onClick={() => setActiveTab('tags')}
            className={`px-4 py-2 font-medium transition-colors border-b-2 ${
              activeTab === 'tags'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            タグ
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 font-medium transition-colors border-b-2 ${
              activeTab === 'users'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            ユーザー
          </button>
        </div>

        {/* 検索結果 */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">検索中...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* 投稿結果 */}
            {(activeTab === 'all' || activeTab === 'posts') && results.posts?.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4">投稿</h2>
                <div className="space-y-4">
                  {results.posts.map((post: any) => (
                    <TriviaPost
                      key={post.id}
                      {...post}
                      hasLiked={false}
                      hasCommunityNote={false}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* タグ結果 */}
            {(activeTab === 'all' || activeTab === 'tags') && results.tags?.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4">タグ</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {results.tags.map((tag: any) => (
                    <div key={tag.id} className="card hover:shadow-md transition-shadow cursor-pointer">
                      <div className="flex items-center space-x-3">
                        <Hash className="w-8 h-8 text-primary-500" />
                        <div>
                          <h3 className="font-bold text-gray-900">{tag.name}</h3>
                          <p className="text-sm text-gray-600">{tag.postCount}件の投稿</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ユーザー結果 */}
            {(activeTab === 'all' || activeTab === 'users') && results.users?.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4">ユーザー</h2>
                <div className="space-y-4">
                  {results.users.map((user: any) => (
                    <div key={user.id} className="card hover:shadow-md transition-shadow cursor-pointer">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-bold">
                          {user.displayName.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900">{user.displayName}</h3>
                          <p className="text-sm text-gray-600">@{user.username}</p>
                          {user.bio && <p className="text-sm text-gray-700 mt-1">{user.bio}</p>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 結果なし */}
            {!isLoading && 
             results.posts?.length === 0 && 
             results.tags?.length === 0 && 
             results.users?.length === 0 && (
              <div className="text-center py-12">
                <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">検索結果が見つかりませんでした</p>
                <p className="text-sm text-gray-500 mt-2">別のキーワードで試してみてください</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
