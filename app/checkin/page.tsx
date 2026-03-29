'use client'
import { useState, useRef, useEffect } from 'react'
import { fetchAllCheckins, saveCheckin, CheckinData } from '@/lib/api'
import { CHECKIN_FIELDS, MILESTONES, PHASES } from '@/lib/data'

const phaseForWeek = (w: number) => {
  if (w <= 3) return PHASES[0]
  if (w <= 7) return PHASES[1]
  if (w <= 10) return PHASES[2]
  return PHASES[3]
}

export default function CheckinPage() {
  const [data, setData] = useState<CheckinData[]>(
    Array.from({ length: 12 }, (_, i) => ({
      week: i, weight: '', waist: '', hips: '',
      chest: '', rightArm: '', rightQuad: '', rightCalf: '',
      workout: '', diet: '', notes: '',
    }))
  )
  const [activeWeek, setActiveWeek] = useState(0)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    fetchAllCheckins().then(rows => {
      if (rows.length > 0) {
        setData(prev => prev.map((p, i) => rows.find(r => r.week === i) ?? p))
      }
    })
  }, [])

  const update = (field: string, value: string) => {
    setData(prev => {
      const next = prev.map((w, i) => i === activeWeek ? { ...w, [field]: value } : w)
      if (saveTimer.current) clearTimeout(saveTimer.current)
      saveTimer.current = setTimeout(async () => {
        setSaving(true)
        setSaved(false)
        await saveCheckin(next[activeWeek])
        setSaving(false)
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
      }, 800)
      return next
    })
  }

  const current = data[activeWeek]
  const phase = phaseForWeek(activeWeek + 1)

  const weights = data.map(d => parseFloat(d.weight)).filter(Boolean)
  const startWeight = 66.7
  const latestWeight = weights.length > 0 ? weights[weights.length - 1] : startWeight
  const lostSoFar = (startWeight - latestWeight).toFixed(1)
  const toGoal = (latestWeight - 59).toFixed(1)

  return (
    <div className="space-y-6 pt-2">

      {/* Stats summary */}
      <div className="grid grid-cols-3 gap-2">
        <div className="card text-center">
          <div className="text-xl font-bold text-[#E8B4A0]">{latestWeight} kg</div>
          <div className="text-[10px] text-[#9A9087] mt-0.5">Current</div>
        </div>
        <div className="card text-center">
          <div className="text-xl font-bold text-[#A0C4B8]">{parseFloat(lostSoFar) > 0 ? lostSoFar : '0'} kg</div>
          <div className="text-[10px] text-[#9A9087] mt-0.5">Lost so far</div>
        </div>
        <div className="card text-center">
          <div className="text-xl font-bold text-[#C4A0D4]">{parseFloat(toGoal) > 0 ? toGoal : '0'} kg</div>
          <div className="text-[10px] text-[#9A9087] mt-0.5">To goal</div>
        </div>
      </div>

      {/* Week selector */}
      <div>
        <p className="section-label">Select Week</p>
        <div className="grid grid-cols-6 gap-1.5">
          {Array.from({ length: 12 }, (_, i) => {
            const p = phaseForWeek(i + 1)
            const hasData = data[i] && CHECKIN_FIELDS.some(f => data[i][f.key as keyof CheckinData])
            return (
              <button
                key={i}
                onClick={() => setActiveWeek(i)}
                className={`rounded-xl py-2 text-center text-xs transition-all font-semibold relative ${
                  activeWeek === i ? 'text-white shadow-sm' : 'bg-[#F0EDE8] text-[#5A524A]'
                }`}
                style={activeWeek === i ? { background: p.color } : {}}
              >
                W{i + 1}
                {hasData && activeWeek !== i && (
                  <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#A0C4B8]" />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Week header */}
      <div className="rounded-2xl p-4 border-l-4" style={{ background: phase.bg, borderColor: phase.color }}>
        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold text-sm">Week {activeWeek + 1}</div>
            <div className="text-xs text-[#9A9087] mt-0.5">Phase {phase.id}: {phase.label} · Weeks {phase.weeks}</div>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full text-white" style={{ background: phase.color }}>
            {phase.label}
          </span>
        </div>
        <p className="text-xs mt-2 text-[#5A524A]">{phase.desc}</p>
      </div>

      {/* FAB reminder */}
      <div className="rounded-xl bg-[#FFF8F0] border border-[#E8B4A0]/30 px-4 py-3">
        <div className="font-semibold text-xs text-[#C07050] mb-1">📸 FAB Protocol — Weigh in every Sunday</div>
        <div className="text-xs text-[#9A9087]">
          <strong>F</strong>asted · <strong>A</strong>fter washroom · <strong>B</strong>efore eating anything
        </div>
      </div>

      {/* Measurements */}
      <div>
        <p className="section-label">Measurements</p>
        <div className="grid grid-cols-2 gap-3">
          {CHECKIN_FIELDS.map(f => (
            <div key={f.key} className="card">
              <label className="text-xs text-[#9A9087] block mb-1">{f.icon} {f.label}</label>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  step="0.1"
                  value={current[f.key as keyof CheckinData] ?? ''}
                  onChange={e => update(f.key, e.target.value)}
                  placeholder="—"
                  className="w-full text-base font-semibold bg-transparent outline-none border-b border-[#EDE8E3] pb-1 focus:border-[#E8B4A0]"
                />
                <span className="text-xs text-[#9A9087] shrink-0">{f.unit}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ratings */}
      <div>
        <p className="section-label">Self-Assessment</p>
        <div className="space-y-3">
          {[
            { key: 'workout', label: 'Workout effort this week', icon: '🏋️' },
            { key: 'diet',    label: 'Diet adherence this week', icon: '🥗' },
          ].map(item => (
            <div key={item.key} className="card">
              <div className="text-xs text-[#9A9087] mb-2">{item.icon} {item.label}</div>
              <div className="flex gap-1.5">
                {Array.from({ length: 10 }, (_, i) => i + 1).map(n => (
                  <button
                    key={n}
                    onClick={() => update(item.key, String(n))}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      current[item.key as keyof CheckinData] === String(n)
                        ? 'bg-[#2A2520] text-[#F5EFE8]'
                        : 'bg-[#F0EDE8] text-[#9A9087] hover:bg-[#E8E3DC]'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div className="card">
        <label className="text-xs text-[#9A9087] block mb-2">📝 Notes & observations</label>
        <textarea
          value={current.notes ?? ''}
          onChange={e => update('notes', e.target.value)}
          placeholder="How did this week feel? Any PRs? Challenges? Observations..."
          rows={3}
          className="w-full text-sm bg-transparent outline-none resize-none placeholder:text-[#C8C0B8] border-none"
        />
      </div>

      {/* Save indicator */}
      <div className={`w-full py-4 rounded-2xl font-semibold text-sm text-center transition-all ${
        saved   ? 'bg-[#A0C4B8] text-white' :
        saving  ? 'bg-[#F0EDE8] text-[#9A9087]' :
                  'bg-[#2A2520] text-[#F5EFE8]'
      }`}>
        {saved ? '✓ Saved!' : saving ? 'Saving…' : `Week ${activeWeek + 1} — auto-saves as you type`}
      </div>

      {/* 12-week table */}
      <div>
        <p className="section-label">12-Week Progress Table</p>
        <div className="overflow-x-auto rounded-2xl border border-[#EDE8E3]">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-[#2A2520] text-[#F5EFE8]">
                <th className="px-3 py-2.5 text-left">Week</th>
                <th className="px-2 py-2.5 text-center">Phase</th>
                <th className="px-2 py-2.5 text-center">Weight</th>
                <th className="px-2 py-2.5 text-center">Waist</th>
                <th className="px-2 py-2.5 text-center">Hips</th>
              </tr>
            </thead>
            <tbody>
              {data.map((w, i) => {
                const p = phaseForWeek(i + 1)
                return (
                  <tr
                    key={i}
                    onClick={() => setActiveWeek(i)}
                    className={`border-b border-[#EDE8E3] cursor-pointer transition-colors ${
                      activeWeek === i ? 'bg-[#FFF8F0]' : i % 2 === 0 ? 'bg-white' : 'bg-[#FAFAF8]'
                    }`}
                  >
                    <td className="px-3 py-2 font-semibold">W{i + 1}</td>
                    <td className="px-2 py-2 text-center">
                      <span
                        className="inline-block px-2 py-0.5 rounded-full text-white font-semibold"
                        style={{ background: p.color, fontSize: 9 }}
                      >
                        {p.label}
                      </span>
                    </td>
                    <td className="px-2 py-2 text-center text-[#5A524A]">{w.weight ? `${w.weight} kg` : '—'}</td>
                    <td className="px-2 py-2 text-center text-[#5A524A]">{w.waist  ? `${w.waist}"` : '—'}</td>
                    <td className="px-2 py-2 text-center text-[#5A524A]">{w.hips   ? `${w.hips}"` : '—'}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Milestones */}
      <div>
        <p className="section-label">Target Milestones</p>
        <div className="space-y-2">
          {MILESTONES.map((m, i) => (
            <div key={i} className="card flex gap-3 items-start">
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