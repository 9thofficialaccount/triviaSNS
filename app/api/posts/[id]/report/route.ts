import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/prisma'

// 投稿を通報
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 認証チェック
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { reason, description } = body
    const reporterId = session.user.id

    const report = await prisma.report.create({
      data: {
        postId: params.id,
        reporterId,
        reason,
        description,
        status: 'PENDING',
      },
    })

    // 通報数をチェック
    const reportCount = await prisma.report.count({
      where: {
        postId: params.id,
        status: 'PENDING',
      },
    })

    // 一定数（例：5件）に達したら審査中に変更
    if (reportCount >= 5) {
      await prisma.report.updateMany({
        where: {
          postId: params.id,
          status: 'PENDING',
        },
        data: {
          status: 'UNDER_REVIEW',
        },
      })
    }

    return NextResponse.json({ report, reportCount }, { status: 201 })
  } catch (error) {
    console.error('Failed to create report:', error)
    return NextResponse.json(
      { error: 'Failed to create report' },
      { status: 500 }
    )
  }
}

// 通報一覧を取得（管理者用）
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const reports = await prisma.report.findMany({
      where: {
        postId: params.id,
      },
      include: {
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
