import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q') || ''
    const type = searchParams.get('type') || 'all' // all, posts, tags, users

    if (!query) {
      return NextResponse.json({ results: [] })
    }

    let results: any = {}

    // 投稿を検索
    if (type === 'all' || type === 'posts') {
      const posts = await prisma.post.findMany({
        where: {
          OR: [
            { preface: { contains: query, mode: 'insensitive' } },
            { content: { contains: query, mode: 'insensitive' } },
          ],
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
        },
        take: 20,
        orderBy: {
          createdAt: 'desc',
        },
      })

      results.posts = posts.map((post) => ({
        id: post.id,
        author: post.author,
        preface: post.preface,
        content: post.content,
        sources: post.sources,
        tags: post.tags.map((t) => t.tag.name),
        likes: post.likes.length,
        comments: post.comments.length,
        createdAt: post.createdAt,
      }))
    }

    // タグを検索
    if (type === 'all' || type === 'tags') {
      const tags = await prisma.tag.findMany({
        where: {
          name: { contains: query, mode: 'insensitive' },
        },
        include: {
          posts: {
            select: {
              id: true,
            },
          },
        },
        take: 10,
      })

      results.tags = tags.map((tag) => ({
        id: tag.id,
        name: tag.name,
        description: tag.description,
        postCount: tag.posts.length,
      }))
    }

    // ユーザーを検索
    if (type === 'all' || type === 'users') {
      const users = await prisma.user.findMany({
        where: {
          OR: [
            { username: { contains: query, mode: 'insensitive' } },
            { displayName: { contains: query, mode: 'insensitive' } },
          ],
        },
        select: {
          id: true,
          username: true,
          displayName: true,
          avatar: true,
          bio: true,
        },
        take: 10,
      })

      results.users = users
    }

    return NextResponse.json(results)
  } catch (error) {
    console.error('Search failed:', error)
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    )
  }
}
