import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, username, displayName, password } = body

    // バリデーション
    if (!email || !username || !displayName || !password) {
      return NextResponse.json(
        { error: 'すべてのフィールドを入力してください' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'パスワードは8文字以上にしてください' },
        { status: 400 }
      )
    }

    // ユーザー名とメールの重複チェック
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username },
        ],
      },
    })

    if (existingUser) {
      if (existingUser.email === email) {
        return NextResponse.json(
          { error: 'このメールアドレスは既に使用されています' },
          { status: 400 }
        )
      }
      if (existingUser.username === username) {
        return NextResponse.json(
          { error: 'このユーザー名は既に使用されています' },
          { status: 400 }
        )
      }
    }

    // パスワードをハッシュ化
    const hashedPassword = await hash(password, 12)

    // ユーザーを作成
    const user = await prisma.user.create({
      data: {
        email,
        username,
        displayName,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        username: true,
        displayName: true,
        isAdmin: true,
        createdAt: true,
      },
    })

    return NextResponse.json(
      { 
        message: 'アカウントを作成しました',
        user 
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'アカウント作成に失敗しました' },
      { status: 500 }
    )
  }
}
