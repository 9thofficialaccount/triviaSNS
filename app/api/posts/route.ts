import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/prisma'
import { suggestTags } from '@/lib/ai-tags'
import { 
  isWithinCharLimit, 
  isValidUrl, 
  sanitizeText, 
  checkRateLimit, 
  getClientIp 
} from '@/lib/security'

export const dynamic = 'force-dynamic'

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

    // レート制限チェック（1分間に3投稿まで）
    const clientIp = getClientIp(request)
    const rateLimit = checkRateLimit(`post:${session.user.id}:${clientIp}`, 3, 60000)
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: '投稿が多すぎます。しばらくしてから再度お試しください。' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { preface, content, sources } = body
    const authorId = session.user.id

    // バリデーション
    if (!preface || !isWithinCharLimit(preface, 130)) {
      return NextResponse.json(
        { error: '前段は1-130文字で入力してください' },
        { status: 400 }
      )
    }

    if (!content || !isWithinCharLimit(content, 130)) {
      return NextResponse.json(
        { error: 'トリビアは1-130文字で入力してください' },
        { status: 400 }
      )
    }

    if (!sources || sources.length === 0) {
      return NextResponse.json(
        { error: '引用元を最低1つ追加してください' },
        { status: 400 }
      )
    }

    // 引用元のURL検証
    for (const source of sources) {
      if (source.url && !isValidUrl(source.url)) {
        return NextResponse.json(
          { error: '無効なURLが含まれています' },
          { status: 400 }
        )
      }
    }

    // AIによるタグ提案
    const suggestedTags = await suggestTags(preface, content)

    // 投稿を作成（サニタイズ）
    const post = await prisma.post.create({
      data: {
        preface: sanitizeText(preface.trim()),
        content: sanitizeText(content.trim()),
        authorId,
        sources: {
          create: sources.map((s: any) => ({
            type: s.type,
            title: s.title ? sanitizeText(s.title.trim()) : null,
            url: s.url ? s.url.trim() : null,
            author: s.author ? sanitizeText(s.author.trim()) : null,
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
