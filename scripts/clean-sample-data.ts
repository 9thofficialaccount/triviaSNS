// サンプルデータをすべて削除するスクリプト

import { PrismaClient } from '@prisma/client'
import * as readline from 'readline'

const prisma = new PrismaClient()

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

function question(query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, resolve)
  })
}

async function main() {
  console.log('🗑️  サンプルデータ削除スクリプト\n')
  console.log('⚠️  警告: このスクリプトはすべての投稿、コメント、いいね、タグ、通報を削除します。')
  console.log('⚠️  ユーザーアカウントは削除されません。\n')

  const confirm = await question('本当に削除しますか？ (yes/no): ')

  if (confirm.toLowerCase() !== 'yes') {
    console.log('キャンセルしました。')
    process.exit(0)
  }

  console.log('\n削除を開始します...\n')

  try {
    // 順番に削除（外部キー制約を考慮）
    
    // 1. Screenshots
    const screenshots = await prisma.screenshot.deleteMany()
    console.log(`✅ Screenshots: ${screenshots.count}件 削除`)

    // 2. CommunityNotes
    const notes = await prisma.communityNote.deleteMany()
    console.log(`✅ CommunityNotes: ${notes.count}件 削除`)

    // 3. Reports
    const reports = await prisma.report.deleteMany()
    console.log(`✅ Reports: ${reports.count}件 削除`)

    // 4. Likes
    const likes = await prisma.like.deleteMany()
    console.log(`✅ Likes: ${likes.count}件 削除`)

    // 5. Comments
    const comments = await prisma.comment.deleteMany()
    console.log(`✅ Comments: ${comments.count}件 削除`)

    // 6. PostTags
    const postTags = await prisma.postTag.deleteMany()
    console.log(`✅ PostTags: ${postTags.count}件 削除`)

    // 7. UserTags
    const userTags = await prisma.userTag.deleteMany()
    console.log(`✅ UserTags: ${userTags.count}件 削除`)

    // 8. Sources
    const sources = await prisma.source.deleteMany()
    console.log(`✅ Sources: ${sources.count}件 削除`)

    // 9. Posts
    const posts = await prisma.post.deleteMany()
    console.log(`✅ Posts: ${posts.count}件 削除`)

    // 10. Tags
    const tags = await prisma.tag.deleteMany()
    console.log(`✅ Tags: ${tags.count}件 削除`)

    console.log('\n🎉 すべてのサンプルデータを削除しました！')
    console.log('ℹ️  ユーザーアカウントは保持されています。\n')

    // ユーザー数を表示
    const userCount = await prisma.user.count()
    console.log(`現在のユーザー数: ${userCount}人\n`)

  } catch (error) {
    console.error('❌ エラーが発生しました:', error)
    process.exit(1)
  }
}

main()
  .catch((e) => {
    console.error('❌ エラー:', e)
    process.exit(1)
  })
  .finally(async () => {
    rl.close()
    await prisma.$disconnect()
  })
