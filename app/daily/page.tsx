'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import {
  fetchDayLog, saveDayLog, DayLog, MealEntry,
  fetchWeightLog, saveWeightEntry, deleteWeightEntry, WeightEntry
} from '@/lib/api'

const START_WEIGHT = 66.7
const GOAL_WEIGHT = 59

const DEFAULT_TRAINING_MEALS: MealEntry[] = [
  { id: 'morning', label: 'Morning drink', detail: '', time: 'On waking', done: false },
  { id: 'preworkout', label: 'Pre-workout coffee', detail: '', time: '10 min before', done: false },
  { id: 'meal1', label: 'Meal 1 — Post workout', detail: '', time: '', done: false },
  { id: 'meal2', label: 'Meal 2 — Lunch', detail: '', time: '2–3pm', done: false },
  { id: 'snack', label: 'Snack (optional)', detail: '', time: '5–6pm', done: false },
  { id: 'meal3', label: 'Meal 3 — Dinner', detail: '', time: 'Evening', done: false },
]

const DEFAULT_REST_MEALS: MealEntry[] = [
  { id: 'morning', label: 'Morning drink', detail: '', time: 'On waking', done: false },
  { id: 'meal1', label: 'Meal 1 (break fast)', detail: '', time: '12:30–1pm', done: false },
  { id: 'snack', label: 'Snack', detail: '', time: '5–6pm', done: false },
  { id: 'meal2', label: 'Meal 2 — Dinner', detail: '', time: '8:30–9:30pm', done: false },
]

const SUPPLEMENTS = [
  // { key: 'multivitamin', label: 'Multivitamin', dose: '1 tablet',  icon: '💊', daily: true,  weekly: false },
  { key: 'b12', label: 'B12', dose: '1 serving', icon: '+', daily: true, weekly: false },
  { key: 'vitaminD', label: 'Vitamin D', dose: '60,000 IU', icon: '☀️', daily: false, weekly: true },
]

const MEAL_COLORS = ['#E8B4A0', '#A0AED4', '#A0C4B8', '#C4A0D4', '#E8B4A0', '#A0C4B8']

function todayKey() { return new Date().toISOString().slice(0, 10) }

function formatDate(key: string) {
  return new Date(key + 'T00:00:00').toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'short',
  })
}

function offsetDate(key: string, delta: number) {
  const d = new Date(key + 'T00:00:00')
  d.setDate(d.getDate() + delta)
  return d.toISOString().slice(0, 10)
}

function emptyDay(dayType: 'training' | 'rest', date: string): DayLog {
  return {
    date,
    dayType,
    water: 0,
    meals: dayType === 'training'
      ? DEFAULT_TRAINING_MEALS.map(m => ({ ...m }))
      : DEFAULT_REST_MEALS.map(m => ({ ...m })),
    supplements: {},
    notes: '',
  }
}

export default function DailyPage() {
  const [dateKey, setDateKey] = useState(todayKey)
  const [log, setLog] = useState<DayLog | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingMeal, setEditingMeal] = useState<string | null>(null)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // ── weight state ────────────────────────────────────────────────────────
  const [weightLog, setWeightLog] = useState<WeightEntry[]>([])
  const [weightInput, setWeightInput] = useState('')
  const [weightSaving, setWeightSaving] = useState(false)
  const [weightDeleting, setWeightDeleting] = useState<string | null>(null)

  // load day log whenever date changes
  useEffect(() => {
    setLoading(true)
    fetchDayLog(dateKey).then(data => {
      setLog(data ?? emptyDay('training', dateKey))
      setLoading(false)
    })
  }, [dateKey])

  // load full weight log once on mount
  useEffect(() => {
    fetchWeightLog().then(setWeightLog)
  }, [])

  // ── weight helpers ──────────────────────────────────────────────────────
  const todayEntry = weightLog.find(e => e.date === dateKey)

  const yesterdayKey = (() => {
    const d = new Date(dateKey + 'T00:00:00')
    d.setDate(d.getDate() - 1)
    return d.toISOString().slice(0, 10)
  })()
  const yesterdayEntry = weightLog.find(e => e.date === yesterdayKey)

  const delta = todayEntry && yesterdayEntry
    ? (todayEntry.weight - yesterdayEntry.weight).toFixed(1)
    : null

  // pre-fill input when date changes
  useEffect(() => {
    setWeightInput(todayEntry ? String(todayEntry.weight) : '')
  }, [dateKey, todayEntry?.weight])

  const handleWeightSave = async () => {
    const val = parseFloat(weightInput)
    if (isNaN(val) || val < 30 || val > 200) return
    setWeightSaving(true)
    await saveWeightEntry(dateKey, val)
    setWeightLog(prev => {
      const next = prev.filter(e => e.date !== dateKey)
      return [...next, { date: dateKey, weight: val }].sort((a, b) => a.date.localeCompare(b.date))
    })
    setWeightInput('')
    setWeightSaving(false)
  }

  const handleWeightDelete = async (date: string) => {
    setWeightDeleting(date)
    await deleteWeightEntry(date)
    setWeightLog(prev => prev.filter(e => e.date !== date))
    setWeightDeleting(null)
  }

  // last 7 logged entries for mini bar chart
  const recentLog = weightLog.slice(-7)

  // ── day log helpers ─────────────────────────────────────────────────────
  const updateLog = useCallback((patch: Partial<DayLog>) => {
    setLog(prev => {
      if (!prev) return prev
      const next = { ...prev, ...patch }
      if (saveTimer.current) clearTimeout(saveTimer.current)
      saveTimer.current = setTimeout(async () => {
        setSaving(true)
        await saveDayLog(next)
        setSaving(false)
      }, 800)
      return next
    })
  }, [])

  const switchDayType = (type: 'training' | 'rest') => {
    updateLog({
      dayType: type,
      meals: type === 'training'
        ? DEFAULT_TRAINING_MEALS.map(m => ({ ...m }))
        : DEFAULT_REST_MEALS.map(m => ({ ...m })),
    })
  }

  const toggleMeal = (id: string) => {
    if (!log) return
    updateLog({ meals: log.meals.map(m => m.id === id ? { ...m, done: !m.done } : m) })
  }

  const updateMealDetail = (id: string, detail: string) => {
    if (!log) return
    updateLog({ meals: log.meals.map(m => m.id === id ? { ...m, detail } : m) })
  }

  const addMeal = () => {
    if (!log) return
    const m: MealEntry = {
      id: `custom-${Date.now()}`, label: 'Custom meal', detail: '', time: '', done: false,
    }
    updateLog({ meals: [...log.meals, m] })
    setEditingMeal(m.id)
  }

  const GLASS_COUNT = 8
  const isToday = dateKey === todayKey()

  if (loading) return (
    <div className="pt-16 text-center text-[#9A9087] text-sm">Loading...</div>
  )
  if (!log) return null

  const waterL = (log.water * 0.5).toFixed(1)
  const mealsDone = log.meals.filter(m => m.done).length

  // weight summary numbers
  const latestLogged = weightLog.length ? weightLog[weightLog.length - 1].weight : START_WEIGHT
  const lostKg = (START_WEIGHT - latestLogged).toFixed(1)
  const toGoal = Math.max(latestLogged - GOAL_WEIGHT, 0).toFixed(1)

  return (
    <div className="space-y-5 pt-2">

      {/* ── date nav ─────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <div className="font-semibold text-base">{formatDate(dateKey)}</div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-[#9A9087]">
              {mealsDone}/{log.meals.length} meals · {waterL}L water
            </span>
            {saving && <span className="text-[10px] text-[#A0C4B8]">saving…</span>}
            {!saving && log.water > 0 && <span className="text-[10px] text-[#A0C4B8]">✓ saved</span>}
          </div>
        </div>
        <div className="flex gap-1.5">
          <button
            onClick={() => setDateKey(k => offsetDate(k, -1))}
            className="px-3 py-1.5 text-xs rounded-xl border border-[#EDE8E3] bg-white text-[#5A524A]"
          >←</button>
          <button
            onClick={() => setDateKey(todayKey())}
            disabled={isToday}
            className="px-3 py-1.5 text-xs rounded-xl border border-[#EDE8E3] bg-white text-[#5A524A] disabled:opacity-40"
          >Today</button>
          <button
            onClick={() => setDateKey(k => offsetDate(k, 1))}
            disabled={isToday}
            className="px-3 py-1.5 text-xs rounded-xl border border-[#EDE8E3] bg-white text-[#5A524A] disabled:opacity-40"
          >→</button>
        </div>
      </div>

      {/* ── day type ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-2">
        {(['training', 'rest'] as const).map(t => (
          <button
            key={t}
            onClick={() => switchDayType(t)}
            className={`py-2.5 rounded-xl text-sm font-semibold transition-all ${log.dayType === t ? 'bg-[#2A2520] text-[#F5EFE8]' : 'bg-[#F0EDE8] text-[#5A524A]'
              }`}
          >
            {t === 'training' ? '🏋️ Training day' : '🌿 Rest / cardio day'}
          </button>
        ))}
      </div>

      {/* ── weight log ───────────────────────────────────────────────────── */}
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <p className="section-label mb-0">Morning weight · FAB</p>
          {todayEntry && (
            <span className="text-xs text-[#9A9087]">
              logged:{' '}
              <span className="font-semibold text-[#2A2520]">{todayEntry.weight} kg</span>
            </span>
          )}
        </div>

        {/* input row */}
        <div className="flex gap-2 items-center">
          <div className="relative flex-1">
            <input
              type="number"
              step="0.1"
              min="30"
              max="200"
              value={weightInput}
              onChange={e => setWeightInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleWeightSave()}
              placeholder={todayEntry ? String(todayEntry.weight) : 'e.g. 65.4'}
              className="w-full text-base font-semibold bg-[#FAFAF8] border border-[#EDE8E3] rounded-xl px-3 py-2.5 outline-none focus:border-[#E8B4A0] pr-8"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#9A9087]">kg</span>
          </div>
          <button
            onClick={handleWeightSave}
            disabled={weightSaving || !weightInput}
            className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-40 ${weightSaving ? 'bg-[#F0EDE8] text-[#9A9087]' : 'bg-[#2A2520] text-[#F5EFE8]'
              }`}
          >
            {weightSaving ? 'Saving…' : todayEntry ? 'Update' : 'Log'}
          </button>
          {todayEntry && (
            <button
              onClick={() => handleWeightDelete(dateKey)}
              disabled={weightDeleting === dateKey}
              className="px-3 py-2.5 rounded-xl text-sm border border-[#EDE8E3] text-[#9A9087] hover:border-red-200 hover:text-red-400 transition-all disabled:opacity-40"
            >
              {weightDeleting === dateKey ? '…' : '✕'}
            </button>
          )}
        </div>

        {/* delta from yesterday */}
        {delta !== null && (
          <div className={`mt-2 text-xs flex items-center gap-1.5 ${parseFloat(delta) < 0 ? 'text-[#1D9E75]'
              : parseFloat(delta) > 0 ? 'text-[#E24B4A]'
                : 'text-[#9A9087]'
            }`}>
            <span>{parseFloat(delta) < 0 ? '▼' : parseFloat(delta) > 0 ? '▲' : '→'}</span>
            <span>
              {parseFloat(delta) === 0
                ? 'No change from yesterday'
                : `${parseFloat(delta) > 0 ? '+' : ''}${delta} kg from yesterday (${yesterdayEntry!.weight} kg)`
              }
            </span>
          </div>
        )}

        {!yesterdayEntry && !todayEntry && (
          <p className="text-xs text-[#9A9087] mt-2">
            Fasted · after washroom · before eating — log every morning
          </p>
        )}

        {/* mini bar trend — last 7 entries */}
        {recentLog.length > 1 && (
          <div className="mt-4">
            <div className="text-[10px] text-[#9A9087] uppercase tracking-wider mb-2">
              Last {recentLog.length} days
            </div>
            <div className="flex items-end gap-1.5" style={{ height: 60 }}>
              {recentLog.map(entry => {
                const allW = recentLog.map(e => e.weight)
                const min = Math.min(...allW)
                const max = Math.max(...allW)
                const range = max - min || 1
                const barH = Math.round(((entry.weight - min) / range) * 32 + 10)
                const isSelected = entry.date === dateKey
                const dayLabel = new Date(entry.date + 'T00:00:00')
                  .toLocaleDateString('en-IN', { weekday: 'short' }).slice(0, 2)
                return (
                  <button
                    key={entry.date}
                    onClick={() => setDateKey(entry.date)}
                    className="flex-1 flex flex-col items-center gap-1 group"
                  >
                    <div className={`text-[9px] transition-colors ${isSelected ? 'text-[#C07050] font-semibold' : 'text-[#9A9087] group-hover:text-[#5A524A]'
                      }`}>
                      {entry.weight.toFixed(1)}
                    </div>
                    <div
                      className="w-full rounded-t-sm transition-all"
                      style={{
                        height: barH,
                        background: isSelected ? '#E8B4A0' : '#F0EDE8',
                        border: isSelected ? '1px solid #C89070' : '1px solid #EDE8E3',
                      }}
                    />
                    <div className={`text-[9px] transition-colors ${isSelected ? 'text-[#C07050] font-semibold' : 'text-[#9A9087]'
                      }`}>
                      {dayLabel}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* start / now / goal summary */}
        {weightLog.length > 0 && (
          <div className="mt-4 pt-3 border-t border-[#F0EDE8] grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="text-sm font-semibold text-[#2A2520]">{START_WEIGHT} kg</div>
              <div className="text-[10px] text-[#9A9087]">Start</div>
            </div>
            <div>
              <div className="text-sm font-semibold text-[#E8B4A0]">{latestLogged} kg</div>
              <div className="text-[10px] text-[#9A9087]">
                {parseFloat(lostKg) > 0 ? `−${lostKg} kg` : 'Now'}
              </div>
            </div>
            <div>
              <div className="text-sm font-semibold text-[#2A2520]">{GOAL_WEIGHT} kg</div>
              <div className="text-[10px] text-[#9A9087]">
                {parseFloat(toGoal) > 0 ? `${toGoal} to go` : '🎉 Goal!'}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── water ────────────────────────────────────────────────────────── */}
      <div className="card">
        <p className="section-label">Water intake · target 4L</p>
        <div className="flex gap-2 flex-wrap">
          {Array.from({ length: GLASS_COUNT }, (_, i) => {
            const full = i < log.water
            return (
              <button
                key={i}
                onClick={() => updateLog({ water: log.water === i + 1 ? i : i + 1 })}
                className={`w-10 h-12 rounded-lg border flex items-center justify-center text-base transition-all ${full
                    ? 'bg-[#378ADD] border-[#185FA5] text-[#E6F1FB]'
                    : 'border-[#EDE8E3] text-[#C8C0B8]'
                  }`}
              >💧</button>
            )
          })}
        </div>
        <p className="text-xs text-[#9A9087] mt-3">
          {log.water === 0
            ? 'Tap a glass to log · each = 500ml'
            : log.water === GLASS_COUNT
              ? '🎉 4L goal reached!'
              : `${log.water} glasses · ${waterL}L of 4L`}
        </p>
        <div className="h-1.5 bg-[#F0EDE8] rounded-full overflow-hidden mt-2">
          <div
            className="h-full bg-[#378ADD] rounded-full transition-all duration-300"
            style={{ width: `${(log.water / GLASS_COUNT) * 100}%` }}
          />
        </div>
      </div>

      {/* ── meals ────────────────────────────────────────────────────────── */}
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <p className="section-label mb-0">Meal log</p>
          <span className="text-xs text-[#9A9087]">{mealsDone}/{log.meals.length} done</span>
        </div>
        <div>
          {log.meals.map((meal, idx) => (
            <div key={meal.id} className="py-3 border-b border-[#F0EDE8] last:border-0">
              <div className="flex items-start gap-3">
                <div
                  className="w-2.5 h-2.5 rounded-full mt-1.5 shrink-0"
                  style={{ background: MEAL_COLORS[idx % MEAL_COLORS.length] }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-sm">{meal.label}</span>
                    {meal.time && (
                      <span className="text-[10px] text-[#9A9087] shrink-0">{meal.time}</span>
                    )}
                  </div>
                  {editingMeal === meal.id ? (
                    <input
                      autoFocus
                      value={meal.detail}
                      onChange={e => updateMealDetail(meal.id, e.target.value)}
                      onBlur={() => setEditingMeal(null)}
                      onKeyDown={e => e.key === 'Enter' && setEditingMeal(null)}
                      placeholder="What did you eat?"
                      className="mt-1 w-full text-xs text-[#5A524A] bg-[#FAFAF8] border border-[#EDE8E3] rounded-lg px-2 py-1 outline-none focus:border-[#E8B4A0]"
                    />
                  ) : (
                    <button
                      onClick={() => setEditingMeal(meal.id)}
                      className="mt-0.5 text-xs text-left w-full"
                    >
                      {meal.detail
                        ? <span className="text-[#5A524A]">{meal.detail}</span>
                        : <span className="text-[#C8C0B8] italic">tap to add what you ate</span>
                      }
                    </button>
                  )}
                </div>
                <button
                  onClick={() => toggleMeal(meal.id)}
                  className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-all ${meal.done
                      ? 'bg-[#1D9E75] border-[#0F6E56] text-white'
                      : 'border-[#EDE8E3] text-transparent'
                    }`}
                >
                  <span className="text-xs">✓</span>
                </button>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={addMeal}
          className="mt-3 w-full py-2.5 border border-dashed border-[#EDE8E3] rounded-xl text-xs text-[#9A9087] hover:border-[#A0C4B8] transition-all"
        >
          + add custom meal
        </button>
      </div>

      {/* ── supplements ──────────────────────────────────────────────────── */}
      <div className="card">
        <p className="section-label">Supplements</p>
        <div className="grid grid-cols-2 gap-2">
          {SUPPLEMENTS.filter(s => {
            if (s.daily) return true
            if (s.weekly) {
              const day = new Date(dateKey + 'T00:00:00').getDay()
              return day === 0  // Sunday only — matches your FAB weigh-in day
            }
            return false
          }).map(s => {
            const done = log.supplements[s.key] ?? false
            return (
              <button
                key={s.key}
                onClick={() => updateLog({ supplements: { ...log.supplements, [s.key]: !done } })}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-left transition-all ${done ? 'bg-[#F3FAF8] border-[#A0C4B8]' : 'bg-white border-[#EDE8E3]'
                  }`}
              >
                <span className="text-base">{s.icon}</span>
                <div>
                  <div className="text-xs font-semibold text-[#2A2520]">{s.label}</div>
                  <div className="text-[10px] text-[#9A9087]">{s.dose}</div>
                </div>
              </button>
            )
          })}
        </div>
        <p className="text-[10px] text-[#9A9087] mt-2">
          Vitamin D shown every Sunday as a weekly reminder.
        </p>
      </div>

      {/* ── notes ────────────────────────────────────────────────────────── */}
      <div className="card">
        <p className="section-label">Notes</p>
        <textarea
          value={log.notes}
          onChange={e => updateLog({ notes: e.target.value })}
          placeholder="How did you feel today? Cravings? Energy levels?"
          rows={3}
          className="w-full text-sm text-[#2A2520] bg-transparent outline-none resize-none placeholder:text-[#C8C0B8]"
        />
      </div>

    </div>
  )
}