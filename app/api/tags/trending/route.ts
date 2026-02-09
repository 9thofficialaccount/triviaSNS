import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // 過去7日間の投稿を集計
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const trendingTags = await prisma.tag.findMany({
      include: {
        posts: {
          where: {
            post: {
              createdAt: {
                gte: sevenDaysAgo,
              },
            },
          },
          select: {
            id: true,
          },
        },
      },
    })

    // 投稿数でソート
    const sortedTags = trendingTags
      .map((tag) => ({
        id: tag.id,
        name: tag.name,
        description: tag.description,
        count: tag.posts.length,
      }))
      .filter((tag) => tag.count > 0)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    return NextResponse.json({ tags: sortedTags })
  } catch (error) {
    console.error('Failed to fetch trending tags:', error)
    return NextResponse.json(
      { error: 'Failed to fetch trending tags' },
      { status: 500 }
    )
  }
}
