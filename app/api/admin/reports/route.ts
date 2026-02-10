import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/prisma'

// 管理者：通報一覧を取得
export async function GET(request: NextRequest) {
  try {
    // 管理者認証チェック
    const session = await getServerSession(authOptions)
    if (!session || !session.user.isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status') || 'UNDER_REVIEW'

    const reports = await prisma.report.findMany({
      where: {
        status: status as any,
      },
      include: {
        post: {
          include: {
            author: {
              select: {
                id: true,
                username: true,
                displayName: true,
              },
            },
          },
        },
        reporter: {
          select: {
            id: true,
            username: true,
            displayName: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({ reports })
  } catch (error) {
    console.error('Failed to fetch reports:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reports' },
      { status: 500 }
    )
  }
}

// 管理者：通報を審査
export async function PATCH(request: NextRequest) {
  try {
    // 管理者認証チェック
    const session = await getServerSession(authOptions)
    if (!session || !session.user.isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { reportId, status, reviewNote } = body
    const reviewerId = session.user.id

    const report = await prisma.report.update({
      where: {
        id: reportId,
      },
      data: {
        status,
        reviewNote,
        reviewedBy: reviewerId,
        reviewedAt: new Date(),
      },
    })

    return NextResponse.json({ report })
  } catch (error) {
    console.error('Failed to update report:', error)
    return NextResponse.json(
      { error: 'Failed to update report' },
      { status: 500 }
    )
  }
}
