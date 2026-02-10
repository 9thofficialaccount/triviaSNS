'use client'

import { useState, useEffect } from 'react'
import { Shield, AlertTriangle, FileText, CheckCircle, XCircle, Trash2 } from 'lucide-react'
import Link from 'next/link'

interface Report {
  id: string
  reason: string
  description: string
  status: string
  createdAt: string
  post: {
    id: string
    preface: string
    content: string
    author: {
      displayName: string
      username: string
    }
  }
  reporter: {
    displayName: string
    username: string
  }
}

export default function AdminDashboard() {
  const [reports, setReports] = useState<Report[]>([])
  const [selectedStatus, setSelectedStatus] = useState('UNDER_REVIEW')

  useEffect(() => {
    fetchReports()
  }, [selectedStatus])

  const fetchReports = async () => {
    try {
      const response = await fetch(`/api/admin/reports?status=${selectedStatus}`)
      const data = await response.json()
      setReports(data.reports)
    } catch (error) {
      console.error('Failed to fetch reports:', error)
    }
  }

  const handleReview = async (reportId: string, newStatus: string, note: string) => {
    try {
      await fetch('/api/admin/reports', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reportId,
          status: newStatus,
          reviewNote: note,
        }),
      })
      fetchReports()
    } catch (error) {
      console.error('Failed to update report:', error)
    }
  }

  const handleDeletePost = async (postId: string) => {
    if (!confirm('この投稿を完全に削除しますか？この操作は取り消せません。')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/posts/${postId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        alert('投稿を削除しました')
        fetchReports()
      } else {
        alert('投稿の削除に失敗しました')
      }
    } catch (error) {
      console.error('Failed to delete post:', error)
      alert('投稿の削除に失敗しました')
    }
  }

  const handleFlagPost = async (postId: string) => {
    const reason = prompt('ファクトチェック結果を入力してください：')
    if (!reason) return

    try {
      const response = await fetch(`/api/admin/posts/${postId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'flag',
          reason,
        }),
      })

      if (response.ok) {
        alert('コミュニティノートを追加しました')
        fetchReports()
      } else {
        alert('処理に失敗しました')
      }
    } catch (error) {
      console.error('Failed to flag post:', error)
      alert('処理に失敗しました')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="w-8 h-8 text-red-600" />
              <h1 className="text-2xl font-bold text-gray-900">管理者ダッシュボード</h1>
            </div>
            <Link href="/" className="text-primary-600 hover:text-primary-700 font-medium">
              ← ホームに戻る
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ステータスフィルター */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex space-x-4">
            <button
              onClick={() => setSelectedStatus('PENDING')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedStatus === 'PENDING'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              保留中
            </button>
            <button
              onClick={() => setSelectedStatus('UNDER_REVIEW')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedStatus === 'UNDER_REVIEW'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              審査中
            </button>
            <button
              onClick={() => setSelectedStatus('RESOLVED')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedStatus === 'RESOLVED'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              解決済み
            </button>
            <button
              onClick={() => setSelectedStatus('REJECTED')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedStatus === 'REJECTED'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              却下
            </button>
          </div>
        </div>

        {/* 通報リスト */}
        <div className="space-y-4">
          {reports.map((report) => (
            <div key={report.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start space-x-4">
                <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
                
                <div className="flex-1">
                  {/* 通報情報 */}
                  <div className="mb-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full">
                        {report.reason}
                      </span>
                      <span className="text-sm text-gray-500">
                        通報者: @{report.reporter.username}
                      </span>
                    </div>
                    {report.description && (
                      <p className="text-sm text-gray-700">{report.description}</p>
                    )}
                  </div>

                  {/* 対象投稿 */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <p className="text-sm text-gray-600 mb-2">
                      投稿者: <strong>@{report.post.author.username}</strong>
                    </p>
                    <p className="text-gray-700 mb-2">{report.post.preface}</p>
                    <p className="text-gray-900 font-medium">{report.post.content}</p>
                  </div>

                  {/* アクション */}
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => handleReview(report.id, 'RESOLVED', '通報内容を確認し、適切な対応を行いました。')}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>解決</span>
                    </button>
                    <button
                      onClick={() => handleReview(report.id, 'REJECTED', '通報内容を確認しましたが、問題ないと判断しました。')}
                      className="flex items-center space-x-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>却下</span>
                    </button>
                    <button
                      onClick={() => handleFlagPost(report.post.id)}
                      className="flex items-center space-x-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-medium transition-colors"
                    >
                      <FileText className="w-4 h-4" />
                      <span>ファクトチェック</span>
                    </button>
                    <button
                      onClick={() => handleDeletePost(report.post.id)}
                      className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                    >
                      <AlertTriangle className="w-4 h-4" />
                      <span>投稿を削除</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {reports.length === 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">該当する通報はありません</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
