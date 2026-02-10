import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/prisma'

// 管理者：投稿を削除
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 管理者認証チェック
    const session = await getServerSession(authOptions)
    if (!session || !session.user.isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden: Admin access required' },
        { status: 403 }
      )
    }

    // 投稿を削除（Cascadeで関連データも削除される）
    const post = await prisma.post.delete({
      where: {
        id: params.id,
      },
    })

    return NextResponse.json({ 
      message: 'Post deleted successfully',
      post 
    })
  } catch (error) {
    console.error('Failed to delete post:', error)
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    )
  }
}

// 管理者：投稿のステータス更新（ファクトチェック結果）
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 管理者認証チェック
    const session = await getServerSession(authOptions)
    if (!session || !session.user.isAdmin) {
      return NextResponse.json(
        { error: 'Forbidden: Admin access required' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { action, reason } = body // action: 'approve' | 'flag' | 'remove'

    if (action === 'remove') {
      // 投稿を削除
      const post = await prisma.post.delete({
        where: { id: params.id },
      })
      
      return NextResponse.json({
        message: 'Post removed',
        post,
      })
    }

    if (action === 'flag') {
      // コミュニティノートを作成（管理者による警告）
      const note = await prisma.communityNote.create({
        data: {
          postId: params.id,
          authorId: session.user.id,
          content: reason || '管理者によりファクトチェックされました。',
          status: 'APPROVED',
        },
      })

      return NextResponse.json({
        message: 'Post flagged with community note',
        note,
      })
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Failed to update post:', error)
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    )
  }
}
