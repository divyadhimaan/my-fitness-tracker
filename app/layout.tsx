import type { Metadata } from 'next'
import './globals.css'
import Nav from '@/components/Nav'

export const metadata: Metadata = {
  title: "Divya's 12-Week Plan",
  description: 'Self-directed fitness plan — 66.7kg → 58–60kg',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#FAFAF8] min-h-screen font-serif text-[#2A2520]">
        <Nav />
        <main className="max-w-2xl mx-auto px-4 pb-24 pt-4">
          {children}
        </main>
      </body>
    </html>
  )
}
