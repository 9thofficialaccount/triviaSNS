import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/prisma'

// コミュニティノートを作成
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
    const { content, sources } = body
    const authorId = session.user.id

    const note = await prisma.communityNote.create({
      data: {
        postId: params.id,
        authorId,
        content,
        sources,
        status: 'PENDING',
      },
    })

    return NextResponse.json({ note }, { status: 201 })
  } catch (error) {
    console.error('Failed to create community note:', error)
    return NextResponse.json(
      { error: 'Failed to create community note' },
      { status: 500 }
    )
  }
}

// コミュニティノート一覧を取得
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const notes = await prisma.communityNote.findMany({
      where: {
        postId: params.id,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            displayName: true,
          },
        },
      },
      orderBy: {
        helpfulCount: 'desc',
      },
    })

    return NextResponse.json({ notes })
  } catch (error) {
    console.error('Failed to fetch community notes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch community notes' },
      { status: 500 }
    )
  }
}
