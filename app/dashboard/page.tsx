'use client'
import { useEffect, useState } from 'react'
import { fetchAllCheckins, CheckinData, getLatestWeight, fetchWeightLog } from '@/lib/api'
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, BarElement, Title, Tooltip, Legend, Filler,
} from 'chart.js'
import { Line, Bar } from 'react-chartjs-2'
import { START_WEIGHT, GOAL_WEIGHT, WEEKS, PHASES, MEASURES, STATUS_MESSAGES, TARGET_AVG_LOSS } from '@/lib/data'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler)

function phaseForWeek(w: number) {
  if (w <= 3)  return PHASES[0]
  if (w <= 7)  return PHASES[1]
  if (w <= 10) return PHASES[2]
  return PHASES[3]
}

const wLabels = Array.from({ length: WEEKS }, (_, i) => `W${i + 1}`)

export default function DashboardPage() {
  const [rows, setRows] = useState<CheckinData[]>([])
  const [weightLogs, setWeightLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetchAllCheckins().then(data => setRows(data)),
      fetchWeightLog().then(data => setWeightLogs(data))
    ]).then(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="pt-20 text-center text-sm text-[#9A9087]">Loading your progress…</div>
  )

  // ── derived numbers ───────────────────────────────────────────────────────

  const logged    = rows.filter(r => r.weight)
  const wLogged   = logged.length
  const sortedWeightLogs = weightLogs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  const latestW   = sortedWeightLogs.length > 0 ? sortedWeightLogs[0].weight : START_WEIGHT
  const lostKg    = (START_WEIGHT - latestW).toFixed(1)
  const toGo      = Math.max(latestW - GOAL_WEIGHT, 0).toFixed(1)
  const avgLoss   = wLogged > 1
    ? ((START_WEIGHT - latestW) / (wLogged - 1)).toFixed(2)
    : null
  const currentPhase = phaseForWeek(wLogged || 1)

  // ── chart data ────────────────────────────────────────────────────────────

  const weightActual = Array.from({ length: WEEKS }, (_, i) => {
    const r = rows.find(x => x.week === i)
    return r?.weight ? parseFloat(r.weight) : null
  })

  const weightTarget = Array.from({ length: WEEKS }, (_, i) =>
    parseFloat((START_WEIGHT - (START_WEIGHT - GOAL_WEIGHT) / 11 * i).toFixed(2))
  )

  const workoutScores = Array.from({ length: WEEKS }, (_, i) => {
    const r = rows.find(x => x.week === i)
    return r?.workout ? parseInt(r.workout) : null
  })
  const dietScores = Array.from({ length: WEEKS }, (_, i) => {
    const r = rows.find(x => x.week === i)
    return r?.diet ? parseInt(r.diet) : null
  })

  const firstLogged = rows.find(r => r.weight) ?? null
  const lastLogged  = logged[wLogged - 1] ?? null

  // ── phase bar fill ────────────────────────────────────────────────────────

  const phaseLengths = [3, 4, 3, 2]
  let weekCursor = 0
  const phaseSegments = phaseLengths.map((len, pi) => {
    const weeksInPhase = Math.min(Math.max(wLogged - weekCursor, 0), len)
    const opacity = weeksInPhase > 0 ? (weeksInPhase / len * 0.7 + 0.3) : 0.15
    weekCursor += len
    return { color: PHASES[pi].color, opacity }
  })

  const statusMessages = STATUS_MESSAGES

  return (
    <div className="space-y-5 pt-2">

      {/* ── stat cards ────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {[
          {
            val: `${latestW.toFixed(1)} kg`,
            label: 'Current weight',
            sub: parseFloat(lostKg) > 0
              ? <span className="text-[#1D9E75]">-{lostKg} kg lost</span>
              : <span className="text-[#9A9087]">start: {START_WEIGHT} kg</span>,
          },
          {
            val: `${GOAL_WEIGHT} kg`,
            label: 'Goal',
            sub: <span className="text-[#9A9087]">{toGo} kg to go</span>,
          },
          {
            val: `${wLogged}/12`,
            label: 'Weeks logged',
            sub: <span style={{ color: currentPhase.color }}>{currentPhase.label}</span>,
          },
          {
            val: avgLoss ? `${avgLoss} kg` : '—',
            label: 'Avg loss/week',
            sub: <span className="text-[#9A9087]">target {TARGET_AVG_LOSS}</span>,
          },
        ].map((c, i) => (
          <div key={i} className="bg-[#F0EDE8] rounded-xl p-3">
            <div className="text-xl font-semibold text-[#2A2520]">{c.val}</div>
            <div className="text-[11px] text-[#9A9087] mt-1">{c.label}</div>
            <div className="text-[11px] mt-0.5">{c.sub}</div>
          </div>
        ))}
      </div>

      {/* ── weight chart ─────────────────────────────────── */}
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <p className="section-label mb-0">Weight trend</p>
          <div className="flex gap-3 text-[11px] text-[#9A9087]">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-2 rounded-sm inline-block" style={{ background: '#E8B4A0' }} />
              actual
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-2 rounded-sm inline-block" style={{ background: '#A0C4B8', opacity: 0.6 }} />
              target
            </span>
          </div>
        </div>
        <div style={{ position: 'relative', height: 220 }}>
          <Line
            data={{
              labels: wLabels,
              datasets: [
                {
                  label: 'Weight',
                  data: weightActual,
                  borderColor: '#E8B4A0',
                  backgroundColor: 'rgba(232,180,160,.1)',
                  borderWidth: 2.5,
                  pointBackgroundColor: '#E8B4A0',
                  pointRadius: 4,
                  tension: 0.35,
                  fill: true,
                  spanGaps: false,
                },
                {
                  label: 'Target',
                  data: weightTarget,
                  borderColor: '#A0C4B8',
                  backgroundColor: 'transparent',
                  borderWidth: 1.5,
                  borderDash: [4, 4],
                  pointRadius: 0,
                  tension: 0.35,
                },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false },
                tooltip: { callbacks: { label: ctx => ctx.dataset.label + ': ' + (ctx.parsed.y as number).toFixed(1) + ' kg' } },
              },
              scales: {
                x: { grid: { color: 'rgba(0,0,0,.04)' }, ticks: { font: { size: 11 }, color: '#9A9087', autoSkip: false, maxRotation: 0 } },
                y: { min: 57, max: 68, grid: { color: 'rgba(0,0,0,.04)' }, ticks: { font: { size: 11 }, color: '#9A9087', callback: v => v + ' kg' } },
              },
            }}
          />
        </div>
      </div>

      {/* ── measurements ─────────────────────────────────── */}
      <div className="card">
        <p className="section-label mb-3">Body measurements — change from week 1</p>
        <div className="grid grid-cols-3 gap-2">
          {MEASURES.map(m => {
            const startV  = firstLogged?.[m.key as keyof CheckinData] ? parseFloat(firstLogged[m.key as keyof CheckinData] as string) : null
            const nowV    = lastLogged?.[m.key as keyof CheckinData]  ? parseFloat(lastLogged[m.key as keyof CheckinData] as string)  : null
            const delta   = startV && nowV ? (nowV - startV) : null
            const isGood  = delta !== null && (m.lowerIsBetter ? delta < 0 : delta > 0)
            const isBad   = delta !== null && (m.lowerIsBetter ? delta > 0 : delta < 0)
            return (
              <div key={m.key} className="bg-[#F0EDE8] rounded-xl p-3">
                <div className="text-base font-semibold text-[#2A2520]">
                  {nowV != null ? nowV.toFixed(1) : '—'}
                  <span className="text-xs font-normal text-[#9A9087]"> {m.unit}</span>
                </div>
                <div className="text-[11px] text-[#9A9087] mt-0.5">{m.label}</div>
                <div className={`text-[11px] mt-0.5 ${isGood ? 'text-[#1D9E75]' : isBad ? 'text-[#E24B4A]' : 'text-[#9A9087]'}`}>
                  {delta !== null
                    ? `${delta > 0 ? '+' : ''}${delta.toFixed(1)} ${m.unit}`
                    : 'no data yet'}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── consistency chart ────────────────────────────── */}
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <p className="section-label mb-0">Weekly consistency</p>
          <div className="flex gap-3 text-[11px] text-[#9A9087]">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-2 rounded-sm inline-block" style={{ background: '#E8B4A0' }} />workout
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-2 rounded-sm inline-block" style={{ background: '#A0C4B8' }} />diet
            </span>
          </div>
        </div>
        <div style={{ position: 'relative', height: 180 }}>
          <Bar
            data={{
              labels: wLabels,
              datasets: [
                { label: 'Workout', data: workoutScores, backgroundColor: '#E8B4A0', borderRadius: 4, barPercentage: 0.4, categoryPercentage: 0.7 },
                { label: 'Diet',    data: dietScores,    backgroundColor: '#A0C4B8', borderRadius: 4, barPercentage: 0.4, categoryPercentage: 0.7 },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false },
                tooltip: { callbacks: { label: ctx => ctx.dataset.label + ': ' + ctx.parsed.y + '/10' } },
              },
              scales: {
                x: { grid: { display: false }, ticks: { font: { size: 11 }, color: '#9A9087', autoSkip: false, maxRotation: 0 } },
                y: { min: 0, max: 10, grid: { color: 'rgba(0,0,0,.04)' }, ticks: { font: { size: 11 }, color: '#9A9087', stepSize: 2 } },
              },
            }}
          />
        </div>
      </div>

      {/* ── phase progress ───────────────────────────────── */}
      <div className="card">
        <p className="section-label mb-3">Phase progress</p>
        <div className="grid grid-cols-4 gap-1 mb-2">
          {PHASES.map(p => (
            <div key={p.label} className="text-center text-[10px] text-[#9A9087]">
              {p.label}<br />{p.weeks}
            </div>
          ))}
        </div>
        <div className="flex gap-1 h-2 rounded-full overflow-hidden mb-3">
          {phaseSegments.map((s, i) => (
            <div
              key={i}
              className="flex-1 rounded-sm"
              style={{ background: s.color, opacity: s.opacity }}
            />
          ))}
        </div>
        <p className="text-xs text-[#9A9087]">{statusMessages[Math.min(wLogged, 12)]}</p>
      </div>

      {wLogged === 0 && (
        <div className="card text-center py-8">
          <div className="text-3xl mb-3">📊</div>
          <div className="font-semibold text-sm text-[#2A2520] mb-1">No data yet</div>
          <p className="text-xs text-[#9A9087] mb-4">Log your first weekly check-in to see your progress charts populate.</p>
          <a href="/checkin" className="inline-block px-5 py-2.5 bg-[#2A2520] text-[#F5EFE8] rounded-xl text-sm font-semibold">
            Go to Check-in →
          </a>
        </div>
      )}

    </div>
  )
}