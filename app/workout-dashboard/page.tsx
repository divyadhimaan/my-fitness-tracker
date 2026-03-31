'use client'
import { useEffect, useState } from 'react'
import { fetchAllWorkoutLogs, WorkoutLog } from '@/lib/api'
import { WORKOUTS, SPLIT } from '@/lib/data'
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  PointElement, LineElement, Tooltip, Legend,
} from 'chart.js'
import { Bar, Line } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Tooltip, Legend)

const PHASE_COLORS: Record<string, string> = {
  phase1: '#E8B4A0',
  phase2: '#A0C4B8',
}

function formatDate(d: string) {
  return new Date(d + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

export default function WorkoutDashboardPage() {
  const [logs,    setLogs]    = useState<WorkoutLog[]>([])
  const [loading, setLoading] = useState(true)
  const [focusEx, setFocusEx] = useState<string>('')

  useEffect(() => {
    fetchAllWorkoutLogs().then(data => {
      setLogs(data)
      // default focus exercise = first one with logged weight data
      for (const log of data) {
        for (const ex of log.exercises) {
          if (ex.sets.some(s => s.weight && s.weight !== 'BW')) {
            setFocusEx(ex.name)
            break
          }
        }
        if (focusEx) break
      }
      setLoading(false)
    })
  }, [])

  if (loading) return (
    <div className="pt-20 text-center text-sm text-[#9A9087]">Loading workout history…</div>
  )

  // ── derived stats ─────────────────────────────────────────────────────

  const totalSessions   = logs.filter(l => l.completed).length
  const totalSets       = logs.reduce((acc, l) => acc + l.exercises.reduce((a, e) => a + e.sets.filter(s => s.reps).length, 0), 0)
  const avgDuration     = logs.filter(l => l.duration > 0).length
    ? Math.round(logs.filter(l => l.duration > 0).reduce((a, l) => a + l.duration, 0) / logs.filter(l => l.duration > 0).length)
    : 0

  // sessions per day type
  const dayCounts = { A: 0, B: 0, C: 0, D: 0 }
  logs.forEach(l => { if (l.completed) dayCounts[l.day as keyof typeof dayCounts]++ })

  // last 8 sessions — volume (total reps × weight)
  const recentSessions = [...logs].sort((a, b) => a.date.localeCompare(b.date)).slice(-8)
  const volumeData = recentSessions.map(l => {
    const vol = l.exercises.reduce((acc, ex) =>
      acc + ex.sets.reduce((a, s) => {
        const w = parseFloat(s.weight) || 0
        const r = parseInt(s.reps)     || 0
        return a + w * r
      }, 0), 0)
    return Math.round(vol)
  })

  // exercise progression — weight over time for selected exercise
  const exHistory = logs
    .filter(l => l.exercises.some(e => e.name === focusEx))
    .sort((a, b) => a.date.localeCompare(b.date))
    .map(l => {
      const ex  = l.exercises.find(e => e.name === focusEx)!
      const max = Math.max(...ex.sets.map(s => parseFloat(s.weight) || 0))
      return { date: l.date, max }
    })
    .filter(e => e.max > 0)

  // all unique exercise names across all logs for the selector
  const allExerciseNames = Array.from(
    new Set(logs.flatMap(l => l.exercises.map(e => e.name)))
  ).sort()

  // streak — consecutive days with a completed workout
  const completedDates = new Set(logs.filter(l => l.completed).map(l => l.date))
  let streak = 0
  const today = new Date()
  for (let i = 0; i < 30; i++) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    if (completedDates.has(d.toISOString().slice(0, 10))) streak++
    else if (i > 0) break
  }

  // last 12 weeks heatmap data
  const heatmapWeeks: { date: string; done: boolean }[][] = []
  for (let w = 11; w >= 0; w--) {
    const week: { date: string; done: boolean }[] = []
    for (let d = 6; d >= 0; d--) {
      const dt = new Date()
      dt.setDate(dt.getDate() - w * 7 - d)
      const key = dt.toISOString().slice(0, 10)
      week.push({ date: key, done: completedDates.has(key) })
    }
    heatmapWeeks.push(week)
  }

  return (
    <div className="space-y-5 pt-2">

      {/* ── stat cards ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {[
          { val: totalSessions,          label: 'Sessions done',    sub: 'completed'       },
          { val: `${streak}d`,           label: 'Current streak',   sub: 'consecutive days' },
          { val: totalSets,              label: 'Total sets',        sub: 'all time'         },
          { val: avgDuration ? `${avgDuration}m` : '—', label: 'Avg duration', sub: 'per session' },
        ].map((c, i) => (
          <div key={i} className="bg-[#F0EDE8] rounded-xl p-3">
            <div className="text-xl font-semibold text-[#2A2520]">{c.val}</div>
            <div className="text-[11px] text-[#9A9087] mt-1">{c.label}</div>
            <div className="text-[11px] text-[#9A9087]">{c.sub}</div>
          </div>
        ))}
      </div>

      {/* ── activity heatmap ────────────────────────────────────────── */}
      <div className="card">
        <p className="section-label mb-3">Activity — last 12 weeks</p>
        <div className="flex gap-1 overflow-x-auto pb-1">
          {heatmapWeeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-1">
              {week.map(day => (
                <div
                  key={day.date}
                  title={day.date}
                  className="w-4 h-4 rounded-sm"
                  style={{ background: day.done ? '#A0C4B8' : '#F0EDE8' }}
                />
              ))}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 mt-2 text-[10px] text-[#9A9087]">
          <span className="w-3 h-3 rounded-sm inline-block" style={{ background: '#F0EDE8' }} /> no workout
          <span className="w-3 h-3 rounded-sm inline-block ml-2" style={{ background: '#A0C4B8' }} /> completed
        </div>
      </div>

      {/* ── sessions per day type ────────────────────────────────────── */}
      <div className="card">
        <p className="section-label mb-3">Sessions by day type</p>
        <div className="grid grid-cols-4 gap-2">
          {SPLIT.map(s => {
            const count = dayCounts[s.id as keyof typeof dayCounts]
            const max   = Math.max(...Object.values(dayCounts), 1)
            return (
              <div key={s.id} className="text-center">
                <div className="text-2xl mb-1">{s.emoji}</div>
                <div className="h-16 bg-[#F0EDE8] rounded-lg relative overflow-hidden">
                  <div
                    className="absolute bottom-0 left-0 right-0 rounded-lg transition-all"
                    style={{ height: `${(count / max) * 100}%`, background: '#E8B4A0' }}
                  />
                </div>
                <div className="text-xs font-semibold text-[#2A2520] mt-1">{count}x</div>
                <div className="text-[10px] text-[#9A9087]">Day {s.id}</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── volume over last 8 sessions ──────────────────────────────── */}
      {recentSessions.length > 1 && (
        <div className="card">
          <p className="section-label mb-3">Volume trend — last {recentSessions.length} sessions</p>
          <div className="text-[10px] text-[#9A9087] mb-2">total kg lifted (weight × reps)</div>
          <div style={{ position: 'relative', height: 160 }}>
            <Bar
              data={{
                labels: recentSessions.map(l => formatDate(l.date)),
                datasets: [{
                  label: 'Volume (kg)',
                  data: volumeData,
                  backgroundColor: recentSessions.map(l => PHASE_COLORS[l.phase] ?? '#E8B4A0'),
                  borderRadius: 6,
                  barPercentage: 0.6,
                }],
              }}
              options={{
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                  x: { grid: { display: false }, ticks: { font: { size: 10 }, color: '#9A9087' } },
                  y: { grid: { color: 'rgba(0,0,0,.04)' }, ticks: { font: { size: 10 }, color: '#9A9087' } },
                },
              }}
            />
          </div>
        </div>
      )}

      {/* ── exercise progression ─────────────────────────────────────── */}
      <div className="card">
        <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
          <p className="section-label mb-0">Exercise progression</p>
          <select
            value={focusEx}
            onChange={e => setFocusEx(e.target.value)}
            className="text-xs border border-[#EDE8E3] rounded-lg px-2 py-1.5 bg-white text-[#2A2520] outline-none max-w-[180px]"
          >
            <option value="">— pick exercise —</option>
            {allExerciseNames.map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>

        {exHistory.length > 1 ? (
          <div style={{ position: 'relative', height: 180 }}>
            <Line
              data={{
                labels: exHistory.map(e => formatDate(e.date)),
                datasets: [{
                  label: 'Max weight (kg)',
                  data: exHistory.map(e => e.max),
                  borderColor: '#E8B4A0',
                  backgroundColor: 'rgba(232,180,160,.1)',
                  borderWidth: 2.5,
                  pointBackgroundColor: '#E8B4A0',
                  pointRadius: 4,
                  tension: 0.3,
                  fill: true,
                }],
              }}
              options={{
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { display: false },
                  tooltip: { callbacks: { label: ctx => `${(ctx.parsed.y as number).toFixed(1)} kg` } },
                },
                scales: {
                  x: { grid: { display: false }, ticks: { font: { size: 10 }, color: '#9A9087' } },
                  y: { grid: { color: 'rgba(0,0,0,.04)' }, ticks: { font: { size: 10 }, color: '#9A9087', callback: v => v + ' kg' } },
                },
              }}
            />
          </div>
        ) : (
          <div className="text-center py-6 text-xs text-[#9A9087]">
            {focusEx
              ? `Not enough data for "${focusEx}" yet — log at least 2 sessions with weights.`
              : 'Select an exercise to see its weight progression over time.'
            }
          </div>
        )}
      </div>

      {/* ── recent sessions list ─────────────────────────────────────── */}
      <div className="card">
        <p className="section-label mb-3">Recent sessions</p>
        {logs.length === 0 ? (
          <div className="text-center py-6 text-xs text-[#9A9087]">No workouts logged yet.</div>
        ) : (
          <div className="space-y-2">
            {[...logs].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 10).map((l, i) => {
              const split = SPLIT.find(s => s.id === l.day)
              const setsLogged = l.exercises.reduce((a, e) => a + e.sets.filter(s => s.reps).length, 0)
              return (
                <div key={i} className="flex items-center gap-3 py-2.5 border-b border-[#F0EDE8] last:border-0">
                  <div className="text-2xl">{split?.emoji ?? '🏋️'}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-[#2A2520]">
                      Day {l.day} — {split?.label}
                    </div>
                    <div className="text-[10px] text-[#9A9087] mt-0.5">
                      {formatDate(l.date)} · {setsLogged} sets logged
                      {l.duration > 0 && ` · ${l.duration} min`}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span
                      className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                      style={{
                        background: PHASE_COLORS[l.phase] + '30',
                        color: l.phase === 'phase1' ? '#C07050' : '#3A8A72',
                      }}
                    >
                      {l.phase === 'phase1' ? 'Foundation' : 'Full'}
                    </span>
                    {l.completed && (
                      <span className="text-[10px] text-[#3A8A72]">✓</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {logs.length === 0 && (
        <div className="card text-center py-10">
          <div className="text-4xl mb-3">📊</div>
          <div className="font-semibold text-sm text-[#2A2520] mb-1">No workout data yet</div>
          <p className="text-xs text-[#9A9087] mb-4">Log your first workout to see your strength progress here.</p>
          <a href="/workouts" className="inline-block px-5 py-2.5 bg-[#2A2520] text-[#F5EFE8] rounded-xl text-sm font-semibold">
            Go to Workouts →
          </a>
        </div>
      )}

    </div>
  )
}