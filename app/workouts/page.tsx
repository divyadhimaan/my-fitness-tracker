'use client'
import { useState } from 'react'
import { SPLIT, WORKOUTS, WARMUP } from '@/lib/data'

export default function WorkoutsPage() {
  const [activeDay, setActiveDay] = useState<'A' | 'B' | 'C' | 'D'>('A')
  const [phase, setPhase] = useState<'phase1' | 'phase2'>('phase1')
  const [done, setDone] = useState<Record<string, boolean>>({})

  const exercises = WORKOUTS[activeDay][phase]
  const splitInfo = SPLIT.find(s => s.id === activeDay)!
  const toggleDone = (key: string) => setDone(prev => ({ ...prev, [key]: !prev[key] }))
  const completedCount = exercises.filter((_, i) => done[`${activeDay}-${phase}-${i}`]).length

  return (
    <div className="space-y-5 pt-2">

      {/* Phase selector */}
      <div>
        <p className="section-label">Select Phase</p>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => { setPhase('phase1'); setDone({}) }}
            className={`py-3 px-4 rounded-xl text-sm font-semibold transition-all ${
              phase === 'phase1'
                ? 'bg-[#E8B4A0] text-white shadow-sm'
                : 'bg-[#F0EDE8] text-[#5A524A] hover:bg-[#E8E3DC]'
            }`}
          >
            🌱 Weeks 1–3<br />
            <span className="text-xs font-normal opacity-80">Foundation</span>
          </button>
          <button
            onClick={() => { setPhase('phase2'); setDone({}) }}
            className={`py-3 px-4 rounded-xl text-sm font-semibold transition-all ${
              phase === 'phase2'
                ? 'bg-[#A0C4B8] text-white shadow-sm'
                : 'bg-[#F0EDE8] text-[#5A524A] hover:bg-[#E8E3DC]'
            }`}
          >
            🔥 Weeks 4–12<br />
            <span className="text-xs font-normal opacity-80">Full Program</span>
          </button>
        </div>
        {phase === 'phase1' && (
          <div className="mt-2 text-xs text-[#C07050] bg-[#FFF8F0] border border-[#E8B4A0]/30 rounded-xl px-3 py-2">
            ⚠️ Weeks 1–3: Use 60–70% of your previous max. Form first, weight second. Your body needs to reawaken.
          </div>
        )}
      </div>

      {/* Day selector */}
      <div>
        <p className="section-label">Select Day</p>
        <div className="grid grid-cols-4 gap-2">
          {SPLIT.map(s => (
            <button
              key={s.id}
              onClick={() => { setActiveDay(s.id as 'A'|'B'|'C'|'D'); setDone({}) }}
              className={`py-3 rounded-xl text-center transition-all ${
                activeDay === s.id
                  ? 'bg-[#2A2520] text-[#F5EFE8]'
                  : 'bg-[#F0EDE8] text-[#5A524A] hover:bg-[#E8E3DC]'
              }`}
            >
              <div className="text-xl">{s.emoji}</div>
              <div className="text-[10px] font-bold mt-1">Day {s.id}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Day header */}
      <div className="card flex items-center gap-3">
        <span className="text-4xl">{splitInfo.emoji}</span>
        <div className="flex-1">
          <div className="font-semibold text-base">{splitInfo.label}</div>
          <div className="text-xs text-[#9A9087]">{splitInfo.muscles}</div>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-[#E8B4A0]">{completedCount}/{exercises.length}</div>
          <div className="text-[10px] text-[#9A9087]">done</div>
        </div>
      </div>

      {/* Progress bar */}
      {completedCount > 0 && (
        <div className="h-1.5 bg-[#F0EDE8] rounded-full overflow-hidden -mt-2">
          <div
            className="h-full bg-[#A0C4B8] rounded-full transition-all duration-500"
            style={{ width: `${(completedCount / exercises.length) * 100}%` }}
          />
        </div>
      )}

      {/* Warmup reminder */}
      <div className="rounded-xl bg-[#FFF8F0] border border-[#E8B4A0]/30 px-4 py-3 flex gap-3 items-start">
        <span className="text-lg">🔆</span>
        <div>
          <div className="text-xs font-semibold text-[#C07050] mb-0.5">Do your warmup first!</div>
          <div className="text-xs text-[#9A9087]">
            {WARMUP.slice(0, 3).map(w => w.name).join(' · ')} · +2 more
          </div>
        </div>
      </div>

      {/* Exercises */}
      <div className="space-y-3">
        {exercises.map((ex, i) => {
          const key = `${activeDay}-${phase}-${i}`
          const isDone = done[key]
          return (
            <div
              key={key}
              className={`card transition-all duration-200 ${isDone ? 'opacity-60' : ''}`}
            >
              <div className="flex items-start gap-3">
                <button
                  onClick={() => toggleDone(key)}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all
                    ${isDone ? 'bg-[#A0C4B8] border-[#A0C4B8]' : 'border-[#E8B4A0]'}`}
                >
                  {isDone && <span className="text-white text-xs">✓</span>}
                </button>
                <div className="flex-1">
                  <div className={`font-semibold text-sm ${isDone ? 'line-through' : ''}`}>{ex.name}</div>
                  <div className="inline-flex items-center mt-1 bg-[#F0EDE8] rounded-full px-2.5 py-0.5 text-xs text-[#5A524A]">
                    {ex.sets}
                  </div>
                  <p className="text-xs text-[#9A9087] mt-1.5 leading-relaxed">💡 {ex.note}</p>
                  {ex.ytLink && (
                    <a
                      href={ex.ytLink}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-[#E8B4A0] hover:underline mt-1"
                    >
                      ▶ Watch tutorial
                    </a>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Cooldown reminder */}
      <div className="rounded-xl bg-[#F3FAF8] border border-[#A0C4B8]/30 px-4 py-3 space-y-1">
        {activeDay !== 'D' && (
          <div className="flex gap-2 text-xs text-[#3A8A72]">
            <span>🚶</span>
            <span>Finish with 15 min treadmill walk · Speed 5.5–6 · Incline 10</span>
          </div>
        )}
        <div className="flex gap-2 text-xs text-[#3A8A72]">
          <span>🧘</span>
          <span>5 min cool-down stretch before leaving the gym</span>
        </div>
        <div className="flex gap-2 text-xs text-[#3A8A72]">
          <span>📹</span>
          <span>Film a tracking video once a month for form & progress comparison</span>
        </div>
      </div>

      {completedCount === exercises.length && exercises.length > 0 && (
        <div className="bg-[#2A2520] text-[#F5EFE8] rounded-2xl p-5 text-center">
          <div className="text-3xl mb-2">🎉</div>
          <div className="font-semibold text-lg">Workout Complete!</div>
          <div className="text-sm text-[#B8AFA8] mt-1">You showed up. That&apos;s the hardest part. See you next session.</div>
        </div>
      )}

    </div>
  )
}
