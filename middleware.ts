import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    // 管理者ページへのアクセス制御
    if (req.nextUrl.pathname.startsWith('/admin')) {
      const token = req.nextauth.token
      if (!token?.isAdmin) {
        return NextResponse.redirect(new URL('/', req.url))
      }
    }
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // /admin へのアクセスは管理者のみ
        if (req.nextUrl.pathname.startsWith('/admin')) {
          return !!token?.isAdmin
        }
        // その他の保護されたルートはログインが必要
        return !!token
      },
    },
  }
)

// 保護するパスを指定
export const config = {
  matcher: ['/admin/:path*'],
}
