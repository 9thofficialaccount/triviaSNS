// 管理者アカウントを作成するスクリプト

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
  console.log('🔐 管理者アカウント作成スクリプト\n')

  const email = await question('メールアドレス: ')
  const username = await question('ユーザー名: ')
  const displayName = await question('表示名: ')
  const password = await question('パスワード（8文字以上）: ')

  if (password.length < 8) {
    console.error('❌ エラー: パスワードは8文字以上にしてください')
    process.exit(1)
  }

  // 既存ユーザーのチェック
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { username }],
    },
  })

  if (existingUser) {
    console.error('❌ エラー: このメールアドレスまたはユーザー名は既に使用されています')
    process.exit(1)
  }

  // パスワードをハッシュ化
  const hashedPassword = await hash(password, 12)

  // 管理者アカウントを作成
  const admin = await prisma.user.create({
    data: {
      email,
      username,
      displayName,
      password: hashedPassword,
      isAdmin: true,
      bio: '管理者',
    },
    select: {
      id: true,
      email: true,
      username: true,
      displayName: true,
      isAdmin: true,
    },
  })

  console.log('\n✅ 管理者アカウントを作成しました！')
  console.log('----------------------------')
  console.log(`ID: ${admin.id}`)
  console.log(`メール: ${admin.email}`)
  console.log(`ユーザー名: ${admin.username}`)
  console.log(`表示名: ${admin.displayName}`)
  console.log(`管理者: ${admin.isAdmin}`)
  console.log('----------------------------\n')
  console.log('このアカウントでログインできます。')
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
