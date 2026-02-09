'use client'

import { useState } from 'react'
import { Heart, MessageCircle, Share2, Flag, FileText } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ja } from 'date-fns/locale'
import { ShareModal } from './ShareModal'
import { ReportModal } from './ReportModal'
import { CommunityNoteModal } from './CommunityNoteModal'

interface Source {
  type: string
  title?: string
  url?: string
  author?: string
}

interface TriviaPostProps {
  id: string
  author: {
    displayName: string
    username: string
    avatar?: string
  }
  preface: string
  content: string
  sources: Source[]
  tags?: string[]
  likes: number
  comments: number
  createdAt: Date
  hasLiked?: boolean
  hasCommunityNote?: boolean
}

export function TriviaPost({
  id,
  author,
  preface,
  content,
  sources,
  tags = [],
  likes,
  comments,
  createdAt,
  hasLiked = false,
  hasCommunityNote = false,
}: TriviaPostProps) {
  const [isLiked, setIsLiked] = useState(hasLiked)
  const [likeCount, setLikeCount] = useState(likes)
  const [showShareModal, setShowShareModal] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)
  const [showNoteModal, setShowNoteModal] = useState(false)

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1)
  }

  return (
    <article className="card hover:shadow-md transition-shadow">
      {/* ヘッダー：ユーザー情報 */}
      <div className="flex items-start space-x-3 mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-bold">
          {author.displayName.charAt(0)}
        </div>
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-gray-900">{author.displayName}</span>
            <span className="text-gray-500 text-sm">@{author.username}</span>
            <span className="text-gray-400 text-sm">·</span>
            <span className="text-gray-500 text-sm">
              {formatDistanceToNow(createdAt, { addSuffix: true, locale: ja })}
            </span>
          </div>
        </div>
      </div>

      {/* 第1層：前段（人間味のある導入） */}
      <div className="mb-3">
        <p className="text-gray-700 leading-relaxed">{preface}</p>
      </div>

      {/* 第2層：トリビア本文（強調表示） */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-primary-500 p-4 mb-3 rounded-r-lg">
        <p className="text-gray-900 font-medium leading-relaxed">{content}</p>
      </div>

      {/* 第3層：引用元（小さめのフォント） */}
      {sources.length > 0 && (
        <div className="mb-4 pl-4 border-l-2 border-gray-200">
          <p className="text-xs text-gray-500 mb-1">📚 引用元：</p>
          <div className="space-y-1">
            {sources.map((source, index) => (
              <div key={index} className="text-sm text-gray-600">
                {source.url ? (
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700 hover:underline"
                  >
                    {source.title || source.url}
                  </a>
                ) : (
                  <span>{source.title || '出典情報'}</span>
                )}
                {source.author && <span className="text-gray-500"> - {source.author}</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* タグ */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 cursor-pointer transition-colors"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* コミュニティノート警告 */}
      {hasCommunityNote && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4 flex items-start space-x-2">
          <FileText className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-amber-800 font-medium">
              この投稿にコミュニティノートが追加されています
            </p>
            <button className="text-sm text-amber-700 hover:text-amber-800 underline">
              詳細を表示
            </button>
          </div>
          <button
            onClick={() => setShowNoteModal(true)}
            className="text-xs text-amber-700 hover:text-amber-800 font-medium whitespace-nowrap"
          >
            + 追加
          </button>
        </div>
      )}

      {/* アクションボタン */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <button
          onClick={handleLike}
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
            isLiked
              ? 'text-red-500 bg-red-50 hover:bg-red-100'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
          <span className="text-sm font-medium">{likeCount}</span>
        </button>

        <button className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
          <MessageCircle className="w-5 h-5" />
          <span className="text-sm font-medium">{comments}</span>
        </button>

        <button 
          onClick={() => setShowShareModal(true)}
          className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <Share2 className="w-5 h-5" />
          <span className="text-sm font-medium">共有</span>
        </button>

        <button 
          onClick={() => setShowReportModal(true)}
          className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <Flag className="w-5 h-5" />
        </button>
      </div>

      {/* モーダル */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        postId={id}
        postContent={content}
      />
      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        postId={id}
      />
      <CommunityNoteModal
        isOpen={showNoteModal}
        onClose={() => setShowNoteModal(false)}
        postId={id}
      />
    </article>
  )
}
