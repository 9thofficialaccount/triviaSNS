// データベースシード（サンプルデータ）

import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 データベースをシードしています...')

  // パスワードをハッシュ化
  const hashedPassword = await hash('password123', 12)

  // ユーザーを作成
  const user1 = await prisma.user.create({
    data: {
      email: 'tanaka@example.com',
      username: 'tanaka_taro',
      displayName: '田中太郎',
      password: hashedPassword,
      bio: '日常の発見を共有しています',
    },
  })

  const user2 = await prisma.user.create({
    data: {
      email: 'yamada@example.com',
      username: 'yamada_hanako',
      displayName: '山田花子',
      password: hashedPassword,
      bio: 'コーヒーと科学が好き',
    },
  })

  const user3 = await prisma.user.create({
    data: {
      email: 'sato@example.com',
      username: 'sato_ichiro',
      displayName: '佐藤一郎',
      password: hashedPassword,
      bio: '子育て中のパパ、毎日が発見',
    },
  })

  const admin = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      username: 'admin',
      displayName: '管理者',
      password: hashedPassword,
      bio: 'トリビアSNS運営チーム',
      isAdmin: true,
    },
  })

  console.log('✅ ユーザーを作成しました')

  // タグを作成
  const tags = await Promise.all([
    prisma.tag.create({ data: { name: '歴史', description: '歴史に関するトリビア' } }),
    prisma.tag.create({ data: { name: '科学', description: '科学に関するトリビア' } }),
    prisma.tag.create({ data: { name: '動物', description: '動物に関するトリビア' } }),
    prisma.tag.create({ data: { name: '地理', description: '地理に関するトリビア' } }),
    prisma.tag.create({ data: { name: '言語', description: '言語に関するトリビア' } }),
    prisma.tag.create({ data: { name: '発明', description: '発明に関するトリビア' } }),
    prisma.tag.create({ data: { name: '日用品', description: '日用品に関するトリビア' } }),
    prisma.tag.create({ data: { name: '健康', description: '健康に関するトリビア' } }),
    prisma.tag.create({ data: { name: 'コーヒー', description: 'コーヒーに関するトリビア' } }),
    prisma.tag.create({ data: { name: '物理学', description: '物理学に関するトリビア' } }),
    prisma.tag.create({ data: { name: '気象', description: '気象に関するトリビア' } }),
    prisma.tag.create({ data: { name: '自然現象', description: '自然現象に関するトリビア' } }),
  ])

  console.log('✅ タグを作成しました')

  // 投稿を作成
  const post1 = await prisma.post.create({
    data: {
      authorId: user1.id,
      preface: '今日雨が降って傘を差した時、ふと構造が気になって調べてみた',
      content: '現代の傘の基本構造は、1852年にイギリスのサミュエル・フォックスが発明した「Uチャンネル式骨組み」が元になっている。これにより傘は軽量で丈夫になった。',
      sources: {
        create: [
          {
            type: 'URL',
            title: 'Wikipedia - 傘',
            url: 'https://ja.wikipedia.org/wiki/傘',
          },
        ],
      },
    },
  })

  await prisma.postTag.createMany({
    data: [
      { postId: post1.id, tagId: tags[0].id, addedBy: 'AI' }, // 歴史
      { postId: post1.id, tagId: tags[5].id, addedBy: 'AI' }, // 発明
      { postId: post1.id, tagId: tags[6].id, addedBy: 'AI' }, // 日用品
    ],
  })

  const post2 = await prisma.post.create({
    data: {
      authorId: user2.id,
      preface: 'カフェでコーヒーを飲んでいる時に店員さんから聞いた話',
      content: 'カフェインの効果が現れるまでには約15〜20分かかり、血中濃度のピークは摂取後30〜60分後。半減期は約4〜6時間で、完全に排出されるまで10時間以上かかる。',
      sources: {
        create: [
          {
            type: 'URL',
            title: '国立健康・栄養研究所 - カフェインの効果',
            url: 'https://example.com/caffeine',
          },
        ],
      },
    },
  })

  await prisma.postTag.createMany({
    data: [
      { postId: post2.id, tagId: tags[1].id, addedBy: 'AI' }, // 科学
      { postId: post2.id, tagId: tags[7].id, addedBy: 'AI' }, // 健康
      { postId: post2.id, tagId: tags[8].id, addedBy: 'AI' }, // コーヒー
    ],
  })

  const post3 = await prisma.post.create({
    data: {
      authorId: user3.id,
      preface: '息子が宿題で「なんで空は青いの？」って聞いてきたので調べた',
      content: '空が青く見えるのは「レイリー散乱」という現象。太陽光が大気中の分子にぶつかった時、波長の短い青い光が散乱しやすい。夕焼けが赤いのも同じ原理で、光路が長くなることで青が散乱し切り赤が残る。',
      sources: {
        create: [
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
      },
    },
  })

  await prisma.postTag.createMany({
    data: [
      { postId: post3.id, tagId: tags[9].id, addedBy: 'AI' }, // 物理学
      { postId: post3.id, tagId: tags[10].id, addedBy: 'AI' }, // 気象
      { postId: post3.id, tagId: tags[11].id, addedBy: 'AI' }, // 自然現象
    ],
  })

  console.log('✅ 投稿を作成しました')

  // いいねを作成
  await prisma.like.createMany({
    data: [
      { postId: post1.id, userId: user2.id },
      { postId: post1.id, userId: user3.id },
      { postId: post2.id, userId: user1.id },
      { postId: post2.id, userId: user3.id },
      { postId: post3.id, userId: user1.id },
    ],
  })

  console.log('✅ いいねを作成しました')

  // コメントを作成
  await prisma.comment.createMany({
    data: [
      {
        postId: post1.id,
        authorId: user2.id,
        content: 'へー！知らなかった。傘の歴史って面白いですね',
      },
      {
        postId: post2.id,
        authorId: user1.id,
        content: 'だから寝る前のコーヒーはダメなんですね',
      },
      {
        postId: post3.id,
        authorId: user2.id,
        content: '子どもの質問って本質をついてますよね',
      },
    ],
  })

  console.log('✅ コメントを作成しました')

  console.log('🎉 シード完了！')
}

main()
  .catch((e) => {
    console.error('❌ シードエラー:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
