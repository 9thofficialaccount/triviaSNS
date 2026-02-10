'use client'

import { useState, useEffect } from 'react'
import { X, Copy, Twitter, Facebook, Link as LinkIcon, Camera } from 'lucide-react'

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  postId: string
  postContent: string
}

export function ShareModal({ isOpen, onClose, postId, postContent }: ShareModalProps) {
  const [copied, setCopied] = useState(false)
  const [isCapturing, setIsCapturing] = useState(false)
  const [shareUrl, setShareUrl] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setShareUrl(`${window.location.origin}/posts/${postId}`)
    }
  }, [postId])

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const handleTwitterShare = () => {
    const text = `${postContent.slice(0, 100)}...`
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`
    window.open(twitterUrl, '_blank', 'width=600,height=400')
  }

  const handleFacebookShare = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
    window.open(facebookUrl, '_blank', 'width=600,height=400')
  }

  const handleCapture = async () => {
    setIsCapturing(true)
    try {
      // TODO: 画像魚拓化機能の実装
      // サーバーサイドでスクリーンショットを撮る
      await fetch(`/api/posts/${postId}/screenshot`, {
        method: 'POST',
      })
      alert('投稿のスクリーンショットを保存しました')
    } catch (error) {
      console.error('Failed to capture:', error)
      alert('スクリーンショットの保存に失敗しました')
    } finally {
      setIsCapturing(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">投稿を共有</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-3">
          {/* リンクをコピー */}
          <button
            onClick={handleCopyLink}
            className="w-full flex items-center space-x-3 p-4 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              {copied ? (
                <span className="text-green-500">✓</span>
              ) : (
                <Copy className="w-5 h-5 text-gray-600" />
              )}
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">
                {copied ? 'コピーしました！' : 'リンクをコピー'}
              </p>
              <p className="text-sm text-gray-500">クリップボードにコピー</p>
            </div>
          </button>

          {/* Twitterで共有 */}
          <button
            onClick={handleTwitterShare}
            className="w-full flex items-center space-x-3 p-4 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Twitter className="w-5 h-5 text-blue-500" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">Twitterで共有</p>
              <p className="text-sm text-gray-500">ツイートする</p>
            </div>
          </button>

          {/* Facebookで共有 */}
          <button
            onClick={handleFacebookShare}
            className="w-full flex items-center space-x-3 p-4 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Facebook className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">Facebookで共有</p>
              <p className="text-sm text-gray-500">シェアする</p>
            </div>
          </button>

          {/* 画像魚拓化 */}
          <button
            onClick={handleCapture}
            disabled={isCapturing}
            className="w-full flex items-center space-x-3 p-4 hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-50"
          >
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <Camera className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">
                {isCapturing ? '保存中...' : '画像として保存'}
              </p>
              <p className="text-sm text-gray-500">スクリーンショットを作成</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
