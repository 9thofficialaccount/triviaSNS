'use client'

import { useState } from 'react'
import { X, FileText } from 'lucide-react'

interface CommunityNoteModalProps {
  isOpen: boolean
  onClose: () => void
  postId: string
}

export function CommunityNoteModal({ isOpen, onClose, postId }: CommunityNoteModalProps) {
  const [content, setContent] = useState('')
  const [sources, setSources] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/posts/${postId}/community-note`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          authorId: 'current-user-id', // TODO: 実際のユーザーIDを使用
          content,
          sources,
        }),
      })

      if (response.ok) {
        alert('コミュニティノートを投稿しました。承認されると表示されます。')
        onClose()
        setContent('')
        setSources('')
      } else {
        alert('コミュニティノートの投稿に失敗しました。')
      }
    } catch (error) {
      console.error('Community note submission failed:', error)
      alert('コミュニティノートの投稿に失敗しました。')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-primary-500" />
            <h3 className="text-lg font-bold text-gray-900">コミュニティノートを追加</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">コミュニティノートとは？</h4>
            <p className="text-sm text-blue-800">
              コミュニティノートは、投稿に補足情報や異なる視点を追加する機能です。
              誤解を招く可能性のある投稿に対して、文脈や追加情報を提供できます。
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ノート内容 <span className="text-red-500">*</span>
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="input-field resize-none"
              rows={6}
              placeholder="この投稿に追加すべき文脈や情報を記載してください..."
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              客観的で建設的な内容を心がけてください
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              引用元（任意）
            </label>
            <textarea
              value={sources}
              onChange={(e) => setSources(e.target.value)}
              className="input-field resize-none"
              rows={3}
              placeholder="参考URLや文献があれば記載してください..."
            />
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800">
              コミュニティノートは他のユーザーによって評価され、
              有用と判断されたものが表示されます。
            </p>
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn-secondary"
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={!content.trim() || isSubmitting}
              className={`flex-1 btn-primary ${
                (!content.trim() || isSubmitting) ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? '送信中...' : '投稿する'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
