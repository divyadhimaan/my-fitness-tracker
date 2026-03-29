import { PHASES, SPLIT, WARMUP, GOLDEN_RULES, MILESTONES } from '@/lib/data'

const WEEK_SCHEDULE = [
  { day: 'Mon', type: 'Day A — Push', rest: false },
  { day: 'Tue', type: 'Day B — Pull', rest: false },
  { day: 'Wed', type: 'Rest', rest: true },
  { day: 'Thu', type: 'Day C — Legs', rest: false },
  { day: 'Fri', type: 'Day D — Cardio', rest: false },
  { day: 'Sat', type: 'Rest', rest: true },
  { day: 'Sun', type: 'Rest', rest: true },
]

export default function HomePage() {
  return (
    <div className="space-y-8 pt-2">

      {/* Progress bar */}
      <div className="card">
        <p className="section-label">Your journey</p>
        <div className="flex justify-between text-sm mb-2">
          <span className="font-semibold">66.7 kg</span>
          <span className="text-[#9A9087]">Target: 58–60 kg</span>
        </div>
        <div className="h-3 bg-[#F0EDE8] rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#E8B4A0] to-[#A0C4B8] rounded-full" style={{ width: '8%' }} />
        </div>
        <p className="text-xs text-[#9A9087] mt-2">~7–8 kg to lose · 12 weeks · You&apos;ve got this 💪</p>
      </div>

      {/* Phases */}
      <div>
        <p className="section-label">The 4 Phases</p>
        <div className="space-y-3">
          {PHASES.map(p => (
            <div
              key={p.id}
              className="rounded-2xl p-4 border-l-4"
              style={{ background: p.bg, borderColor: p.color }}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-sm">Phase {p.id}: {p.label}</span>
                <span
                  className="text-xs font-semibold px-3 py-0.5 rounded-full text-white"
                  style={{ background: p.color }}
                >
                  Weeks {p.weeks}
                </span>
              </div>
              <p className="text-xs text-[#5A524A] leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly schedule */}
      <div>
        <p className="section-label">Weekly Template</p>
        <div className="grid grid-cols-7 gap-1.5">
          {WEEK_SCHEDULE.map(d => (
            <div
              key={d.day}
              className={`rounded-xl p-2 text-center ${d.rest ? 'bg-[#F5F5F3] text-[#9A9087]' : 'bg-[#2A2520] text-[#F5EFE8]'}`}
            >
              <div className="text-[10px] font-bold">{d.day}</div>
              <div className="text-[9px] mt-1 leading-tight">{d.type}</div>
            </div>
          ))}
        </div>
        <p className="text-xs text-[#9A9087] mt-2">Swap days to fit your schedule — just keep rest between hard sessions.</p>
      </div>

      {/* Split */}
      <div>
        <p className="section-label">4-Day Split</p>
        <div className="space-y-2">
          {SPLIT.map(s => (
            <div key={s.id} className="card flex items-center gap-3">
              <span className="text-3xl">{s.emoji}</span>
              <div>
                <div className="font-semibold text-sm">Day {s.id}: {s.label}</div>
                <div className="text-xs text-[#9A9087]">{s.muscles}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Warmup */}
      <div>
        <p className="section-label">Always Start With Warmup</p>
        <div className="rounded-2xl bg-[#FFF8F0] border border-[#E8B4A0]/30 p-4 space-y-2">
          {WARMUP.map((w, i) => (
            <div key={i} className="flex justify-between items-center py-2 border-b border-[#EDE8E3]/50 last:border-0">
              <div>
                <span className="text-sm">{w.name}</span>
                {w.ytLink && (
                  <a href={w.ytLink} target="_blank" rel="noreferrer" className="ml-2 text-[10px] text-[#E8B4A0] underline">▶ Watch</a>
                )}
              </div>
              <span className="text-xs text-[#9A9087]">{w.duration}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Golden Rules */}
      <div>
        <p className="section-label">Golden Rules — Be Your Own Trainer</p>
        <div className="bg-[#2A2520] text-[#F5EFE8] rounded-2xl p-5 space-y-2">
          {GOLDEN_RULES.map((r, i) => (
            <div key={i} className="flex gap-3 text-sm leading-relaxed">
              <span className="text-[#E8B4A0] shrink-0">→</span>
              <span>{r}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Milestones */}
      <div>
        <p className="section-label">Target Milestones</p>
        <div className="card space-y-3">
          {MILESTONES.map((m, i) => (
            <div key={i} className="flex gap-3 pb-3 border-b border-[#EDE8E3] last:border-0 last:pb-0">
              <div className="w-2 h-2 rounded-full bg-[#E8B4A0] mt-1.5 shrink-0" />
              <div>
                <div className="text-xs text-[#9A9087]">{m.week}</div>
                <div className="text-sm">{m.goal}</div>
                <div className="text-xs font-semibold text-[#A0C4B8] mt-0.5">{m.weight}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
