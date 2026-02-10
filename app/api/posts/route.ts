import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/prisma'
import { suggestTags } from '@/lib/ai-tags'

// 投稿一覧を取得
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    const posts = await prisma.post.findMany({
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatar: true,
          },
        },
        sources: true,
        tags: {
          include: {
            tag: true,
          },
        },
        likes: {
          select: {
            userId: true,
          },
        },
        comments: {
          select: {
            id: true,
          },
        },
        communityNotes: {
          where: {
            status: 'APPROVED',
          },
          take: 1,
        },
      },
    })

    const formattedPosts = posts.map((post) => ({
      id: post.id,
      author: post.author,
      preface: post.preface,
      content: post.content,
      sources: post.sources,
      tags: post.tags.map((t) => t.tag.name),
      likes: post.likes.length,
      comments: post.comments.length,
      createdAt: post.createdAt,
      hasCommunityNote: post.communityNotes.length > 0,
    }))

    return NextResponse.json({ posts: formattedPosts })
  } catch (error) {
    console.error('Failed to fetch posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}

// 新しい投稿を作成
export async function POST(request: NextRequest) {
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
    const { preface, content, sources } = body
    const authorId = session.user.id

    // バリデーション
    if (!preface || preface.length > 130) {
      return NextResponse.json(
        { error: 'Preface must be 1-130 characters' },
        { status: 400 }
      )
    }

    if (!content || content.length > 130) {
      return NextResponse.json(
        { error: 'Content must be 1-130 characters' },
        { status: 400 }
      )
    }

    if (!sources || sources.length === 0) {
      return NextResponse.json(
        { error: 'At least one source is required' },
        { status: 400 }
      )
    }

    // AIによるタグ提案
    const suggestedTags = await suggestTags(preface, content)

    // 投稿を作成
    const post = await prisma.post.create({
      data: {
        preface,
        content,
        authorId,
        sources: {
          create: sources.map((s: any) => ({
            type: s.type,
            title: s.title,
            url: s.url,
            author: s.author,
          })),
        },
      },
    })

    // タグを作成または取得して紐付け
    for (const tagName of suggestedTags) {
      const tag = await prisma.tag.upsert({
        where: { name: tagName },
        update: {},
        create: { name: tagName },
      })

      await prisma.postTag.create({
        data: {
          postId: post.id,
          tagId: tag.id,
          addedBy: 'AI',
        },
      })
    }

    return NextResponse.json({ post, suggestedTags }, { status: 201 })
  } catch (error) {
    console.error('Failed to create post:', error)
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    )
  }
}
