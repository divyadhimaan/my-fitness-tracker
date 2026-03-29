'use client'
import { useState } from 'react'
import { useLocalStorage } from '@/lib/useLocalStorage'

// ─── types ────────────────────────────────────────────────────────────────────

interface DayLog {
  water: number          // glasses filled (each = 500ml, target = 8)
  meals: MealEntry[]
  supplements: Record<string, boolean>
  notes: string
}

interface MealEntry {
  id: string
  label: string          // "Meal 1 — Post workout"
  detail: string         // what they actually ate
  time: string
  done: boolean
}

// ─── defaults ────────────────────────────────────────────────────────────────

const DEFAULT_TRAINING_MEALS: MealEntry[] = [
  { id: 'morning', label: 'Morning drink', detail: 'ACV + aloe vera', time: 'On waking', done: false },
  { id: 'preworkout', label: 'Pre-workout coffee', detail: 'Coffee + salt', time: '10 min before gym', done: false },
  { id: 'meal1', label: 'Meal 1 — Post workout', detail: '', time: '', done: false },
  { id: 'meal2', label: 'Meal 2 — Lunch', detail: '', time: '2–3pm', done: false },
  { id: 'snack', label: 'Snack (optional)', detail: '', time: '5–6pm', done: false },
  { id: 'meal3', label: 'Meal 3 — Dinner', detail: '', time: 'Evening', done: false },
]

const DEFAULT_REST_MEALS: MealEntry[] = [
  { id: 'morning', label: 'Morning drink', detail: 'ACV + aloe vera', time: 'On waking', done: false },
  { id: 'meal1', label: 'Meal 1 (break fast)', detail: '', time: '12:30–1pm', done: false },
  { id: 'snack', label: 'Snack', detail: '', time: '5–6pm', done: false },
  { id: 'meal2', label: 'Meal 2 — Dinner', detail: '', time: '8:30–9:30pm', done: false },
]

const SUPPLEMENTS = [
  { key: 'multivitamin', label: 'Multivitamin', dose: '1 tablet', icon: '💊', daily: true },
  { key: 'omega3', label: 'Omega-3', dose: '1 serving', icon: '🐟', daily: true },
  { key: 'vitaminD', label: 'Vitamin D', dose: '60,000 IU', icon: '☀️', daily: false },
]

const MEAL_COLORS = ['#E8B4A0', '#A0AED4', '#A0C4B8', '#C4A0D4', '#E8B4A0', '#A0C4B8']

// ─── helpers ─────────────────────────────────────────────────────────────────

function todayKey() {
  return new Date().toISOString().slice(0, 10)  // "2026-03-29"
}

function formatDate(key: string) {
  const d = new Date(key + 'T00:00:00')
  return d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })
}

function offsetDate(key: string, delta: number) {
  const d = new Date(key + 'T00:00:00')
  d.setDate(d.getDate() + delta)
  return d.toISOString().slice(0, 10)
}

function emptyDay(isTraining: boolean): DayLog {
  return {
    water: 0,
    meals: isTraining ? DEFAULT_TRAINING_MEALS.map(m => ({ ...m })) : DEFAULT_REST_MEALS.map(m => ({ ...m })),
    supplements: {},
    notes: '',
  }
}

// ─── component ───────────────────────────────────────────────────────────────

export default function DailyPage() {
  const [dateKey, setDateKey] = useState(todayKey)
  const [dayType, setDayType] = useState<'training' | 'rest'>('training')
  const [allLogs, setAllLogs] = useLocalStorage<Record<string, DayLog>>('divya-daily-logs', {})
  const [editingMeal, setEditingMeal] = useState<string | null>(null)

  const log: DayLog = allLogs[dateKey] ?? emptyDay(dayType === 'training')

  const update = (patch: Partial<DayLog>) => {
    setAllLogs(prev => ({ ...prev, [dateKey]: { ...log, ...patch } }))
  }

  // water: 8 glasses × 500ml = 4L
  const GLASS_COUNT = 8
  const setWater = (n: number) => update({ water: n })

  // toggle meal done
  const toggleMeal = (id: string) => {
    update({
      meals: log.meals.map(m => m.id === id ? { ...m, done: !m.done } : m)
    })
  }

  // update meal detail
  const updateMealDetail = (id: string, detail: string) => {
    update({
      meals: log.meals.map(m => m.id === id ? { ...m, detail } : m)
    })
  }

  // add custom meal
  const addMeal = () => {
    const newMeal: MealEntry = {
      id: `custom-${Date.now()}`,
      label: 'Custom meal',
      detail: '',
      time: '',
      done: false,
    }
    update({ meals: [...log.meals, newMeal] })
    setEditingMeal(newMeal.id)
  }

  // switch day type — reset meals template but keep water/supplements
  const switchDayType = (type: 'training' | 'rest') => {
    setDayType(type)
    update({
      meals: type === 'training'
        ? DEFAULT_TRAINING_MEALS.map(m => ({ ...m }))
        : DEFAULT_REST_MEALS.map(m => ({ ...m }))
    })
  }

  const waterL = (log.water * 0.5).toFixed(1)
  const mealsCompleted = log.meals.filter(m => m.done).length
  const isToday = dateKey === todayKey()

  return (
    <div className="space-y-5 pt-2">

      {/* Date nav */}
      <div className="flex items-center justify-between">
        <div>
          <div className="font-semibold text-base">{formatDate(dateKey)}</div>
          <div className="text-xs text-[#9A9087] mt-0.5">
            {isToday ? 'Today' : dateKey} · {mealsCompleted}/{log.meals.length} meals · {waterL}L water
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setDateKey(k => offsetDate(k, -1))}
            className="px-3 py-1.5 text-xs rounded-xl border border-[#EDE8E3] bg-white text-[#5A524A] hover:bg-[#F0EDE8]"
          >←</button>
          <button
            onClick={() => setDateKey(todayKey())}
            disabled={isToday}
            className="px-3 py-1.5 text-xs rounded-xl border border-[#EDE8E3] bg-white text-[#5A524A] hover:bg-[#F0EDE8] disabled:opacity-40"
          >Today</button>
          <button
            onClick={() => setDateKey(k => offsetDate(k, 1))}
            disabled={isToday}
            className="px-3 py-1.5 text-xs rounded-xl border border-[#EDE8E3] bg-white text-[#5A524A] hover:bg-[#F0EDE8] disabled:opacity-40"
          >→</button>
        </div>
      </div>

      {/* Training vs rest toggle */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => switchDayType('training')}
          className={`py-2.5 rounded-xl text-sm font-semibold transition-all ${
            dayType === 'training' ? 'bg-[#2A2520] text-[#F5EFE8]' : 'bg-[#F0EDE8] text-[#5A524A]'
          }`}
        >🏋️ Training day</button>
        <button
          onClick={() => switchDayType('rest')}
          className={`py-2.5 rounded-xl text-sm font-semibold transition-all ${
            dayType === 'rest' ? 'bg-[#2A2520] text-[#F5EFE8]' : 'bg-[#F0EDE8] text-[#5A524A]'
          }`}
        >🌿 Rest / cardio day</button>
      </div>

      {/* ── Water tracker ──────────────────────────────── */}
      <div className="card">
        <p className="section-label">Water intake · target 4L</p>
        <div className="flex gap-2 flex-wrap">
          {Array.from({ length: GLASS_COUNT }, (_, i) => {
            const full = i < log.water
            return (
              <button
                key={i}
                onClick={() => setWater(log.water === i + 1 ? i : i + 1)}
                className={`w-10 h-12 rounded-lg border flex items-center justify-center text-base transition-all ${
                  full
                    ? 'bg-[#378ADD] border-[#185FA5] text-[#E6F1FB]'
                    : 'border-[#EDE8E3] text-[#C8C0B8] hover:border-[#A0C4B8]'
                }`}
              >
                💧
              </button>
            )
          })}
        </div>
        <p className="text-xs text-[#9A9087] mt-3">
          {log.water === 0
            ? 'Tap a glass to log · each = 500ml'
            : log.water === GLASS_COUNT
            ? '🎉 Goal reached! 4L done'
            : `${log.water} glass${log.water !== 1 ? 'es' : ''} · ${waterL}L of 4L`
          }
        </p>
        {/* visual fill bar */}
        <div className="h-1.5 bg-[#F0EDE8] rounded-full overflow-hidden mt-2">
          <div
            className="h-full bg-[#378ADD] rounded-full transition-all duration-300"
            style={{ width: `${(log.water / GLASS_COUNT) * 100}%` }}
          />
        </div>
      </div>

      {/* ── Meal log ───────────────────────────────────── */}
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <p className="section-label mb-0">Meal log</p>
          <span className="text-xs text-[#9A9087]">{mealsCompleted}/{log.meals.length} done</span>
        </div>

        <div className="space-y-0">
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
                    {meal.time && <span className="text-[10px] text-[#9A9087] shrink-0">{meal.time}</span>}
                  </div>

                  {/* editable detail */}
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

                {/* check button */}
                <button
                  onClick={() => toggleMeal(meal.id)}
                  className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                    meal.done
                      ? 'bg-[#1D9E75] border-[#0F6E56] text-white'
                      : 'border-[#EDE8E3] text-transparent hover:border-[#A0C4B8]'
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
          className="mt-3 w-full py-2.5 border border-dashed border-[#EDE8E3] rounded-xl text-xs text-[#9A9087] hover:border-[#A0C4B8] hover:text-[#5A524A] transition-all"
        >
          + add custom meal
        </button>
      </div>

      {/* ── Supplements ────────────────────────────────── */}
      <div className="card">
        <p className="section-label">Supplements</p>
        <div className="grid grid-cols-2 gap-2">
          {SUPPLEMENTS.filter(s => s.daily || dateKey.endsWith('-01')).map(s => {
            const done = log.supplements[s.key] ?? false
            return (
              <button
                key={s.key}
                onClick={() => update({ supplements: { ...log.supplements, [s.key]: !done } })}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-left transition-all ${
                  done
                    ? 'bg-[#F3FAF8] border-[#A0C4B8]'
                    : 'bg-white border-[#EDE8E3] hover:border-[#A0C4B8]'
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
        <p className="text-[10px] text-[#9A9087] mt-2">Vitamin D shown on the 1st of each month as a reminder.</p>
      </div>

      {/* ── Notes ──────────────────────────────────────── */}
      <div className="card">
        <p className="section-label">Notes</p>
        <textarea
          value={log.notes}
          onChange={e => update({ notes: e.target.value })}
          placeholder="How did you feel today? Cravings? Energy levels? Anything notable..."
          rows={3}
          className="w-full text-sm text-[#2A2520] bg-transparent outline-none resize-none placeholder:text-[#C8C0B8]"
        />
      </div>

    </div>
  )
}