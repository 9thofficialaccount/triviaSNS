import { Header } from '@/components/Header'
import { Timeline } from '@/components/Timeline'
import { Sidebar } from '@/components/Sidebar'

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* メインコンテンツエリア */}
          <div className="lg:col-span-8">
            <Timeline />
          </div>
          
          {/* サイドバー */}
          <div className="lg:col-span-4">
            <Sidebar />
          </div>
        </div>
      </main>
    </div>
  )
}
