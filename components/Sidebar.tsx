'use client'

import { TrendingUp, Hash } from 'lucide-react'

const trendingTags = [
  { name: '歴史', count: 1234 },
  { name: '科学', count: 987 },
  { name: '動物', count: 856 },
  { name: '地理', count: 743 },
  { name: '言語', count: 621 },
]

const recommendations = [
  {
    username: 'trivia_master',
    displayName: 'トリビアマスター',
    description: '毎日面白いトリビアを投稿',
  },
  {
    username: 'science_fan',
    displayName: 'サイエンスファン',
    description: '科学系トリビア専門',
  },
]

export function Sidebar() {
  return (
    <div className="space-y-4 sticky top-20">
      {/* トレンドタグ */}
      <div className="card">
        <div className="flex items-center space-x-2 mb-4">
          <TrendingUp className="w-5 h-5 text-primary-500" />
          <h3 className="font-bold text-gray-900">トレンドタグ</h3>
        </div>
        <div className="space-y-3">
          {trendingTags.map((tag, index) => (
            <div
              key={tag.name}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <div className="flex items-center space-x-2">
                <span className="text-gray-500 font-medium text-sm">
                  {index + 1}
                </span>
                <Hash className="w-4 h-4 text-gray-400" />
                <span className="font-medium text-gray-900">{tag.name}</span>
              </div>
              <span className="text-sm text-gray-500">
                {tag.count.toLocaleString()}件
              </span>
            </div>
          ))}
        </div>
        <button className="w-full mt-3 text-primary-600 hover:text-primary-700 text-sm font-medium">
          もっと見る
        </button>
      </div>

      {/* おすすめユーザー */}
      <div className="card">
        <h3 className="font-bold text-gray-900 mb-4">おすすめのユーザー</h3>
        <div className="space-y-4">
          {recommendations.map((user) => (
            <div key={user.username} className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                {user.displayName.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">
                  {user.displayName}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  @{user.username}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  {user.description}
                </p>
                <button className="mt-2 text-sm text-primary-600 hover:text-primary-700 font-medium">
                  フォロー
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* フッター */}
      <div className="card text-xs text-gray-500 space-y-2">
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          <a href="#" className="hover:underline">利用規約</a>
          <a href="#" className="hover:underline">プライバシー</a>
          <a href="#" className="hover:underline">ヘルプ</a>
        </div>
        <p>© 2026 トリビアSNS</p>
      </div>
    </div>
  )
}
