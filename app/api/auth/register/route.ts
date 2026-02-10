import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'
import { 
  isValidEmail, 
  isValidUsername, 
  isStrongPassword, 
  checkRateLimit, 
  getClientIp,
  sanitizeText,
  containsSQLInjection
} from '@/lib/security'

export async function POST(request: NextRequest) {
  try {
    // レート制限チェック
    const clientIp = getClientIp(request)
    const rateLimit = checkRateLimit(`register:${clientIp}`, 5, 300000) // 5回/5分
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'リクエストが多すぎます。しばらくしてから再度お試しください。' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { email, username, displayName, password } = body

    // バリデーション
    if (!email || !username || !displayName || !password) {
      return NextResponse.json(
        { error: 'すべてのフィールドを入力してください' },
        { status: 400 }
      )
    }

    // メールアドレスのバリデーション
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: '有効なメールアドレスを入力してください' },
        { status: 400 }
      )
    }

    // ユーザー名のバリデーション
    if (!isValidUsername(username)) {
      return NextResponse.json(
        { error: 'ユーザー名は3-20文字の英数字とアンダースコアのみ使用できます' },
        { status: 400 }
      )
    }

    // SQLインジェクション対策
    if (containsSQLInjection(username) || containsSQLInjection(displayName)) {
      return NextResponse.json(
        { error: '無効な文字が含まれています' },
        { status: 400 }
      )
    }

    // パスワードの強度チェック
    const passwordCheck = isStrongPassword(password)
    if (!passwordCheck.isValid) {
      return NextResponse.json(
        { error: passwordCheck.errors.join(', ') },
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

    // ユーザーを作成（表示名をサニタイズ）
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase().trim(),
        username: username.trim(),
        displayName: sanitizeText(displayName.trim()),
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
