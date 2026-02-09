'use client'

import { TriviaPost } from './TriviaPost'

// サンプルデータ
const samplePosts = [
  {
    id: '1',
    author: {
      displayName: '田中太郎',
      username: 'tanaka_taro',
    },
    preface: '今日雨が降って傘を差した時、ふと構造が気になって調べてみた',
    content: '現代の傘の基本構造は、1852年にイギリスのサミュエル・フォックスが発明した「Uチャンネル式骨組み」が元になっている。これにより傘は軽量で丈夫になった。',
    sources: [
      {
        type: 'URL',
        title: 'Wikipedia - 傘',
        url: 'https://ja.wikipedia.org/wiki/傘',
      },
    ],
    tags: ['歴史', '発明', '日用品'],
    likes: 42,
    comments: 8,
    createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30分前
    hasLiked: false,
    hasCommunityNote: false,
  },
  {
    id: '2',
    author: {
      displayName: '山田花子',
      username: 'yamada_hanako',
    },
    preface: 'カフェでコーヒーを飲んでいる時に店員さんから聞いた話',
    content: 'カフェインの効果が現れるまでには約15〜20分かかり、血中濃度のピークは摂取後30〜60分後。半減期は約4〜6時間で、完全に排出されるまで10時間以上かかる。',
    sources: [
      {
        type: 'URL',
        title: '国立健康・栄養研究所 - カフェインの効果',
        url: 'https://example.com/caffeine',
      },
    ],
    tags: ['科学', '健康', 'コーヒー'],
    likes: 156,
    comments: 23,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2時間前
    hasLiked: true,
    hasCommunityNote: false,
  },
  {
    id: '3',
    author: {
      displayName: '佐藤一郎',
      username: 'sato_ichiro',
    },
    preface: '息子が宿題で「なんで空は青いの？」って聞いてきたので調べた',
    content: '空が青く見えるのは「レイリー散乱」という現象。太陽光が大気中の分子にぶつかった時、波長の短い青い光が散乱しやすい。夕焼けが赤いのも同じ原理で、光路が長くなることで青が散乱し切り赤が残る。',
    sources: [
      {
        type: 'URL',
        title: '気象庁 - 空の色について',
        url: 'https://example.com/sky-color',
      },
      {
        type: 'BOOK',
        title: '光と色の科学',
        author: '山田光男',
      },
    ],
    tags: ['物理学', '気象', '自然現象'],
    likes: 89,
    comments: 15,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5時間前
    hasLiked: false,
    hasCommunityNote: true,
  },
]

export function Timeline() {
  return (
    <div className="space-y-4">
      {/* タイムラインヘッダー */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-2">タイムライン</h2>
        <p className="text-sm text-gray-600">
          最新のトリビアをチェックしよう
        </p>
      </div>

      {/* 投稿一覧 */}
      {samplePosts.map((post) => (
        <TriviaPost key={post.id} {...post} />
      ))}

      {/* もっと読み込むボタン */}
      <div className="text-center py-4">
        <button className="btn-secondary">
          さらに読み込む
        </button>
      </div>
    </div>
  )
}
