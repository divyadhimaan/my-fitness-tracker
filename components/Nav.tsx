'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const LINKS = [
  { href: '/', label: 'Overview', emoji: '📋' },
  { href: '/workouts', label: 'Workouts', emoji: '🏋️' },
  { href: '/diet', label: 'Diet', emoji: '🥗' },
  { href: '/checkin', label: 'Check-in', emoji: '📊' },
  { href: '/daily', label: 'Daily', emoji: '📅' },
  { href: '/dashboard', label: 'Dashboard', emoji: '📈' },
  { href: '/workout-dashboard', label: 'Strength', emoji: '💪' },
]

export default function Nav() {
  const path = usePathname()

  return (
    <>
      {/* Top header */}
      <header className="bg-[#2A2520] text-[#F5EFE8] px-4 py-5 relative overflow-hidden">
        <div className="absolute top-[-40px] right-[-40px] w-48 h-48 rounded-full bg-[#E8B4A0]/10 pointer-events-none" />
        <div className="absolute bottom-[-20px] left-[40%] w-28 h-28 rounded-full bg-[#A0C4B8]/10 pointer-events-none" />
        <p className="text-[10px] tracking-[3px] text-[#E8B4A0] uppercase mb-1">TrainWithYourself</p>
        <h1 className="text-2xl font-normal tracking-wide">Divya&apos;s 12-Week Plan</h1>
        <div className="flex gap-4 mt-2 text-xs text-[#B8AFA8]">
          <span>🎯 Goal: 58–60 kg</span>
          <span>📍 Start: 66.7 kg</span>
          <span>💪 4 days/week</span>
        </div>
      </header>

      {/* Desktop tab bar */}
      <nav className="hidden sm:flex bg-white border-b border-[#EDE8E3] px-4 sticky top-0 z-40">
        {LINKS.map(l => (
          <Link
            key={l.href}
            href={l.href}
            className={`px-4 py-3.5 text-sm border-b-2 transition-colors duration-200 whitespace-nowrap
              ${path === l.href
                ? 'border-[#E8B4A0] text-[#2A2520] font-semibold'
                : 'border-transparent text-[#9A9087] hover:text-[#2A2520]'
              }`}
          >
            {l.emoji} {l.label}
          </Link>
        ))}
      </nav>

      {/* Mobile bottom nav */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#EDE8E3] flex">
        {LINKS.map(l => (
          <Link
            key={l.href}
            href={l.href}
            className={`flex-1 flex flex-col items-center py-3 gap-0.5 text-[10px] transition-colors
              ${path === l.href ? 'text-[#2A2520] font-bold' : 'text-[#9A9087]'}`}
          >
            <span className="text-lg">{l.emoji}</span>
            <span>{l.label}</span>
          </Link>
        ))}
      </nav>
    </>
  )
}
