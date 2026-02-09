'use client'

import { useState } from 'react'
import { X, Plus, Trash2, ExternalLink, BookOpen } from 'lucide-react'

interface Source {
  type: 'URL' | 'BOOK' | 'PAPER' | 'ARTICLE' | 'OTHER'
  title: string
  url?: string
  author?: string
}

interface CreatePostModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CreatePostModal({ isOpen, onClose }: CreatePostModalProps) {
  const [preface, setPreface] = useState('')
  const [content, setContent] = useState('')
  const [sources, setSources] = useState<Source[]>([
    { type: 'URL', title: '', url: '' }
  ])

  const prefaceLength = preface.length
  const contentLength = content.length
  const maxLength = 130

  const addSource = () => {
    setSources([...sources, { type: 'URL', title: '', url: '' }])
  }

  const removeSource = (index: number) => {
    setSources(sources.filter((_, i) => i !== index))
  }

  const updateSource = (index: number, field: keyof Source, value: string) => {
    const newSources = [...sources]
    newSources[index] = { ...newSources[index], [field]: value }
    setSources(newSources)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: API呼び出し
    console.log({ preface, content, sources })
    onClose()
  }

  const isValid = 
    preface.trim() && 
    prefaceLength <= maxLength &&
    content.trim() && 
    contentLength <= maxLength &&
    sources.every(s => s.title.trim() || s.url?.trim())

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* ヘッダー */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">新しいトリビアを投稿</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* 第1層：前段 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              第1層：前段（知識の出どころ）
              <span className="text-xs text-gray-500 ml-2">
                例：「今日雨が降って傘を差した時、ふと構造が気になった」
              </span>
            </label>
            <textarea
              value={preface}
              onChange={(e) => setPreface(e.target.value)}
              className="input-field resize-none"
              rows={3}
              placeholder="トリビアを知ったきっかけや背景を人間味のある形で..."
              maxLength={maxLength}
            />
            <div className="flex justify-between mt-1">
              <span className="text-xs text-gray-500">
                人間味のある導入で興味を引きましょう
              </span>
              <span className={`text-sm font-medium ${
                prefaceLength > maxLength ? 'text-red-500' : 'text-gray-500'
              }`}>
                {prefaceLength} / {maxLength}
              </span>
            </div>
          </div>

          {/* 第2層：トリビア本文 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              第2層：トリビア本文
              <span className="text-xs text-gray-500 ml-2">
                （メインコンテンツ）
              </span>
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="input-field resize-none"
              rows={4}
              placeholder="短く簡潔にトリビアを記述..."
              maxLength={maxLength}
            />
            <div className="flex justify-between mt-1">
              <span className="text-xs text-gray-500">
                核心的な内容を簡潔に
              </span>
              <span className={`text-sm font-medium ${
                contentLength > maxLength ? 'text-red-500' : 'text-gray-500'
              }`}>
                {contentLength} / {maxLength}
              </span>
            </div>
          </div>

          {/* 第3層：引用元 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              第3層：引用元（必須）
            </label>
            <div className="space-y-3">
              {sources.map((source, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <select
                      value={source.type}
                      onChange={(e) => updateSource(index, 'type', e.target.value)}
                      className="input-field text-sm w-40"
                    >
                      <option value="URL">URL</option>
                      <option value="BOOK">書籍</option>
                      <option value="PAPER">論文</option>
                      <option value="ARTICLE">記事</option>
                      <option value="OTHER">その他</option>
                    </select>
                    {sources.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSource(index)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <input
                    type="text"
                    value={source.title}
                    onChange={(e) => updateSource(index, 'title', e.target.value)}
                    className="input-field text-sm"
                    placeholder="タイトル"
                  />

                  {(source.type === 'URL' || source.type === 'ARTICLE') && (
                    <div className="relative">
                      <ExternalLink className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="url"
                        value={source.url || ''}
                        onChange={(e) => updateSource(index, 'url', e.target.value)}
                        className="input-field text-sm pl-10"
                        placeholder="https://..."
                      />
                    </div>
                  )}

                  {(source.type === 'BOOK' || source.type === 'PAPER') && (
                    <div className="relative">
                      <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        value={source.author || ''}
                        onChange={(e) => updateSource(index, 'author', e.target.value)}
                        className="input-field text-sm pl-10"
                        placeholder="著者名"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addSource}
              className="mt-3 flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-medium text-sm"
            >
              <Plus className="w-4 h-4" />
              <span>引用元を追加</span>
            </button>
          </div>

          {/* フッター */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              <p>✓ すべての層が必須です</p>
              <p className="text-xs text-gray-500 mt-1">
                投稿後、AIとユーザーが自動でタグ付けします
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary"
              >
                キャンセル
              </button>
              <button
                type="submit"
                disabled={!isValid}
                className={`btn-primary ${
                  !isValid ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                投稿する
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
