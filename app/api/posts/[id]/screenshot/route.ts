import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 投稿のスクリーンショットを作成（画像魚拓化）
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // TODO: 実際の実装では、Puppeteerなどを使用してスクリーンショットを撮る
    // 例：
    // const browser = await puppeteer.launch()
    // const page = await browser.newPage()
    // await page.goto(`${process.env.NEXTAUTH_URL}/posts/${params.id}`)
    // const screenshot = await page.screenshot()
    // await browser.close()
    // 
    // S3やCloudinaryにアップロードして、URLを取得

    const dummyImageUrl = `https://example.com/screenshots/${params.id}.png`

    const screenshot = await prisma.screenshot.upsert({
      where: {
        postId: params.id,
      },
      update: {
        imageUrl: dummyImageUrl,
      },
      create: {
        postId: params.id,
        imageUrl: dummyImageUrl,
      },
    })

    return NextResponse.json({ screenshot }, { status: 201 })
  } catch (error) {
    console.error('Failed to create screenshot:', error)
    return NextResponse.json(
      { error: 'Failed to create screenshot' },
      { status: 500 }
    )
  }
}
