'use client'

import { useState } from 'react'
import { X, AlertTriangle } from 'lucide-react'

interface ReportModalProps {
  isOpen: boolean
  onClose: () => void
  postId: string
}

const reportReasons = [
  { value: 'FALSE_INFORMATION', label: '誤った情報' },
  { value: 'MISSING_SOURCE', label: '引用元が不適切' },
  { value: 'INAPPROPRIATE_CONTENT', label: '不適切なコンテンツ' },
  { value: 'SPAM', label: 'スパム' },
  { value: 'OTHER', label: 'その他' },
]

export function ReportModal({ isOpen, onClose, postId }: ReportModalProps) {
  const [reason, setReason] = useState('')
  const [description, setDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/posts/${postId}/report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reporterId: 'current-user-id', // TODO: 実際のユーザーIDを使用
          reason,
          description,
        }),
      })

      if (response.ok) {
        alert('通報を受け付けました。運営チームが確認します。')
        onClose()
        setReason('')
        setDescription('')
      } else {
        alert('通報に失敗しました。もう一度お試しください。')
      }
    } catch (error) {
      console.error('Report failed:', error)
      alert('通報に失敗しました。')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <h3 className="text-lg font-bold text-gray-900">投稿を通報</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              通報理由を選択してください
            </label>
            <div className="space-y-2">
              {reportReasons.map((r) => (
                <label
                  key={r.value}
                  className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="reason"
                    value={r.value}
                    checked={reason === r.value}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-4 h-4 text-primary-600"
                  />
                  <span className="text-sm text-gray-900">{r.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              詳細（任意）
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input-field resize-none"
              rows={4}
              placeholder="具体的な理由や詳細があれば記載してください..."
            />
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800">
              通報は運営チームが確認します。虚偽の通報は禁止されています。
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
              disabled={!reason || isSubmitting}
              className={`flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors ${
                (!reason || isSubmitting) ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? '送信中...' : '通報する'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
