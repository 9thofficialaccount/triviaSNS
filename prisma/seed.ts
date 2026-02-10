// データベースシード（テスト用）
// ⚠️ このスクリプトはテスト・開発用です。本番環境では実行しないでください。

import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'
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
  console.log('🌱 データベースシードスクリプト\n')
  console.log('このスクリプトはテスト用のサンプルデータを作成します。')
  console.log('本番環境では実行しないでください。\n')

  const confirm = await question('続けますか？ (yes/no): ')

  if (confirm.toLowerCase() !== 'yes') {
    console.log('キャンセルしました。')
    rl.close()
    return
  }

  console.log('\nサンプルデータを作成しています...\n')

  // パスワードをハッシュ化
  const hashedPassword = await hash('Test1234!', 12)

  // テストユーザーを作成
  const user1 = await prisma.user.create({
    data: {
      email: 'test1@example.com',
      username: 'test_user_1',
      displayName: 'テストユーザー1',
      password: hashedPassword,
      bio: 'テストアカウントです',
    },
  })

  const user2 = await prisma.user.create({
    data: {
      email: 'test2@example.com',
      username: 'test_user_2',
      displayName: 'テストユーザー2',
      password: hashedPassword,
      bio: 'テストアカウントです',
    },
  })

  console.log('✅ テストユーザーを作成しました')
  console.log('\n🎉 シード完了！')
  console.log('\nテストアカウント:')
  console.log('- メール: test1@example.com')
  console.log('- パスワード: Test1234!')
  console.log('---')
  console.log('- メール: test2@example.com')
  console.log('- パスワード: Test1234!')
  console.log('\nℹ️  本番環境では実際のユーザーが登録してください。')
  
  rl.close()
}

main()
  .catch((e) => {
    console.error('❌ シードエラー:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
