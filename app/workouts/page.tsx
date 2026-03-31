'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { SPLIT, WORKOUTS } from '@/lib/data'
import { fetchWorkoutLog, saveWorkoutLog, WorkoutLog, ExerciseLog, SetEntry } from '@/lib/api'

function todayKey() { return new Date().toISOString().slice(0, 10) }

function emptyExerciseLogs(day: string, phase: string): ExerciseLog[] {
  const exercises = WORKOUTS[day]?.[phase as 'phase1' | 'phase2'] ?? []
  return exercises.map(ex => ({
    name: ex.name,
    sets: [{ setNumber: 1, reps: '', weight: '' }],
    notes: '',
  }))
}

function emptyWorkout(day: string, phase: string, date: string): WorkoutLog {
  return {
    date,
    day,
    phase,
    exercises: emptyExerciseLogs(day, phase),
    duration: 0,
    completed: false,
  }
}

export default function WorkoutsPage() {
  const [activeDay,   setActiveDay]   = useState<'A'|'B'|'C'|'D'>('A')
  const [phase,       setPhase]       = useState<'phase1'|'phase2'>('phase1')
  const [dateKey,     setDateKey]     = useState(todayKey)
  const [workoutLog,  setWorkoutLog]  = useState<WorkoutLog | null>(null)
  const [loading,     setLoading]     = useState(false)
  const [saving,      setSaving]      = useState(false)
  const [saved,       setSaved]       = useState(false)
  const [tab,         setTab]         = useState<'plan'|'log'>('plan')
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const startTime = useRef<number | null>(null)

  const splitInfo  = SPLIT.find(s => s.id === activeDay)!
  const exercises  = WORKOUTS[activeDay]?.[phase] ?? []

  // load saved workout log for this date
  useEffect(() => {
    setLoading(true)
    fetchWorkoutLog(dateKey).then(data => {
      if (data) {
        setWorkoutLog(data)
        setActiveDay(data.day as 'A'|'B'|'C'|'D')
        setPhase(data.phase as 'phase1'|'phase2')
      } else {
        setWorkoutLog(null)
      }
      setLoading(false)
    })
  }, [dateKey])

  // auto-save debounced
  const persistLog = useCallback((log: WorkoutLog) => {
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(async () => {
      setSaving(true)
      await saveWorkoutLog(log)
      setSaving(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }, 800)
  }, [])

  const updateLog = (patch: Partial<WorkoutLog>) => {
    setWorkoutLog(prev => {
      const base = prev ?? emptyWorkout(activeDay, phase, dateKey)
      const next = { ...base, ...patch }
      persistLog(next)
      return next
    })
  }

  const startWorkout = () => {
    startTime.current = Date.now()
    const fresh = emptyWorkout(activeDay, phase, dateKey)
    setWorkoutLog(fresh)
    persistLog(fresh)
    setTab('log')
  }

  const finishWorkout = () => {
    const duration = startTime.current
      ? Math.round((Date.now() - startTime.current) / 60000)
      : workoutLog?.duration ?? 0
    updateLog({ completed: true, duration })
  }

  // exercise set helpers
  const updateSet = (exIdx: number, setIdx: number, field: keyof SetEntry, value: string) => {
    if (!workoutLog) return
    const exercises = workoutLog.exercises.map((ex, ei) => {
      if (ei !== exIdx) return ex
      return {
        ...ex,
        sets: ex.sets.map((s, si) => si === setIdx ? { ...s, [field]: value } : s),
      }
    })
    updateLog({ exercises })
  }

  const addSet = (exIdx: number) => {
    if (!workoutLog) return
    const exercises = workoutLog.exercises.map((ex, ei) => {
      if (ei !== exIdx) return ex
      const last = ex.sets[ex.sets.length - 1]
      return {
        ...ex,
        sets: [...ex.sets, {
          setNumber: ex.sets.length + 1,
          reps: last?.reps ?? '',
          weight: last?.weight ?? '',
        }],
      }
    })
    updateLog({ exercises })
  }

  const removeSet = (exIdx: number, setIdx: number) => {
    if (!workoutLog) return
    const exercises = workoutLog.exercises.map((ex, ei) => {
      if (ei !== exIdx) return ex
      const sets = ex.sets.filter((_, si) => si !== setIdx)
        .map((s, i) => ({ ...s, setNumber: i + 1 }))
      return { ...ex, sets }
    })
    updateLog({ exercises })
  }

  const updateExNote = (exIdx: number, notes: string) => {
    if (!workoutLog) return
    const exercises = workoutLog.exercises.map((ex, ei) =>
      ei === exIdx ? { ...ex, notes } : ex
    )
    updateLog({ exercises })
  }

  const isToday = dateKey === todayKey()

  return (
    <div className="space-y-5 pt-2">

      {/* ── top tab bar ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => setTab('plan')}
          className={`py-2.5 rounded-xl text-sm font-semibold transition-all ${
            tab === 'plan' ? 'bg-[#2A2520] text-[#F5EFE8]' : 'bg-[#F0EDE8] text-[#5A524A]'
          }`}
        >📋 View plan</button>
        <button
          onClick={() => setTab('log')}
          className={`py-2.5 rounded-xl text-sm font-semibold transition-all ${
            tab === 'log' ? 'bg-[#2A2520] text-[#F5EFE8]' : 'bg-[#F0EDE8] text-[#5A524A]'
          }`}
        >📝 Log workout</button>
      </div>

      {/* ── phase selector ────────────────────────────────────────────── */}
      <div>
        <p className="section-label">Phase</p>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setPhase('phase1')}
            className={`py-3 px-4 rounded-xl text-sm font-semibold transition-all ${
              phase === 'phase1' ? 'bg-[#E8B4A0] text-white' : 'bg-[#F0EDE8] text-[#5A524A]'
            }`}
          >🌱 Weeks 1–3<br /><span className="text-xs font-normal opacity-80">Foundation</span></button>
          <button
            onClick={() => setPhase('phase2')}
            className={`py-3 px-4 rounded-xl text-sm font-semibold transition-all ${
              phase === 'phase2' ? 'bg-[#A0C4B8] text-white' : 'bg-[#F0EDE8] text-[#5A524A]'
            }`}
          >🔥 Weeks 4–12<br /><span className="text-xs font-normal opacity-80">Full program</span></button>
        </div>
        {phase === 'phase1' && (
          <div className="mt-2 text-xs text-[#C07050] bg-[#FFF8F0] border border-[#E8B4A0]/30 rounded-xl px-3 py-2">
            ⚠️ Weeks 1–3: Use 60–70% of max. Form first, weight second.
          </div>
        )}
      </div>

      {/* ── day selector ──────────────────────────────────────────────── */}
      <div>
        <p className="section-label">Day</p>
        <div className="grid grid-cols-4 gap-2">
          {SPLIT.map(s => (
            <button
              key={s.id}
              onClick={() => setActiveDay(s.id as 'A'|'B'|'C'|'D')}
              className={`py-3 rounded-xl text-center transition-all ${
                activeDay === s.id
                  ? 'bg-[#2A2520] text-[#F5EFE8]'
                  : 'bg-[#F0EDE8] text-[#5A524A]'
              }`}
            >
              <div className="text-xl">{s.emoji}</div>
              <div className="text-[10px] font-bold mt-1">Day {s.id}</div>
            </button>
          ))}
        </div>
      </div>

      {/* day header */}
      <div className="card flex items-center gap-3">
        <span className="text-4xl">{splitInfo.emoji}</span>
        <div>
          <div className="font-semibold text-base">{splitInfo.label}</div>
          <div className="text-xs text-[#9A9087]">{splitInfo.muscles}</div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════
          PLAN TAB
      ════════════════════════════════════════════════════════════════ */}
      {tab === 'plan' && (
        <div className="space-y-3">
          {exercises.map((ex, i) => (
            <div key={i} className="card">
              <div className="flex items-start justify-between gap-2">
                <div className="font-semibold text-sm flex-1">{ex.name}</div>
                <div className="bg-[#F0EDE8] rounded-full px-2.5 py-0.5 text-xs text-[#5A524A] shrink-0">
                  {ex.sets}
                </div>
              </div>
              <p className="text-xs text-[#9A9087] mt-1.5 leading-relaxed">💡 {ex.note}</p>
              {ex.ytLink && (
                <a href={ex.ytLink} target="_blank" rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-[#E8B4A0] hover:underline mt-1">
                  ▶ Watch tutorial
                </a>
              )}
            </div>
          ))}
          <div className="rounded-xl bg-[#F3FAF8] border border-[#A0C4B8]/30 px-4 py-3 space-y-1">
            {activeDay !== 'D' && (
              <div className="text-xs text-[#3A8A72]">🚶 Finish: 15 min treadmill · Speed 5.5–6 · Incline 10</div>
            )}
            <div className="text-xs text-[#3A8A72]">🧘 5 min cool-down stretch</div>
          </div>
          <button
            onClick={() => { setTab('log'); if (!workoutLog) startWorkout() }}
            className="w-full py-3 bg-[#2A2520] text-[#F5EFE8] rounded-xl text-sm font-semibold"
          >
            Start logging this workout →
          </button>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════
          LOG TAB
      ════════════════════════════════════════════════════════════════ */}
      {tab === 'log' && (
        <div className="space-y-4">

          {/* date + status bar */}
          <div className="flex items-center justify-between">
            <div className="text-xs text-[#9A9087]">
              {new Date(dateKey + 'T00:00:00').toLocaleDateString('en-IN', {
                weekday: 'short', day: 'numeric', month: 'short'
              })}
            </div>
            <div className="flex items-center gap-2">
              {saving && <span className="text-[10px] text-[#A0C4B8]">saving…</span>}
              {saved  && <span className="text-[10px] text-[#A0C4B8]">✓ saved</span>}
              {workoutLog?.completed && (
                <span className="text-[10px] bg-[#F3FAF8] border border-[#A0C4B8]/40 text-[#3A8A72] px-2 py-0.5 rounded-full">
                  ✓ completed
                  {workoutLog.duration > 0 && ` · ${workoutLog.duration} min`}
                </span>
              )}
            </div>
          </div>

          {!workoutLog ? (
            <div className="card text-center py-8">
              <div className="text-3xl mb-3">🏋️</div>
              <div className="font-semibold text-sm mb-1">No workout logged for this day</div>
              <p className="text-xs text-[#9A9087] mb-4">Start logging to track your sets, reps, and weights.</p>
              <button
                onClick={startWorkout}
                className="px-6 py-2.5 bg-[#2A2520] text-[#F5EFE8] rounded-xl text-sm font-semibold"
              >
                Start workout
              </button>
            </div>
          ) : (
            <>
              {workoutLog.exercises.map((exLog, exIdx) => {
                const planEx = exercises.find(e => e.name === exLog.name)
                return (
                  <div key={exIdx} className="card space-y-3">
                    {/* exercise header */}
                    <div>
                      <div className="font-semibold text-sm">{exLog.name}</div>
                      {planEx && (
                        <div className="text-[10px] text-[#9A9087] mt-0.5">
                          Plan: {planEx.sets}
                        </div>
                      )}
                    </div>

                    {/* set rows */}
                    <div className="space-y-2">
                      {/* header */}
                      <div className="grid grid-cols-[32px_1fr_1fr_28px] gap-2 text-[10px] text-[#9A9087] uppercase tracking-wide px-1">
                        <span>Set</span>
                        <span>Weight (kg)</span>
                        <span>Reps</span>
                        <span></span>
                      </div>

                      {exLog.sets.map((s, setIdx) => (
                        <div key={setIdx} className="grid grid-cols-[32px_1fr_1fr_28px] gap-2 items-center">
                          <div className="w-8 h-8 rounded-lg bg-[#F0EDE8] flex items-center justify-center text-xs font-semibold text-[#5A524A]">
                            {s.setNumber}
                          </div>
                          <input
                            type="number"
                            step="0.5"
                            min="0"
                            value={s.weight}
                            onChange={e => updateSet(exIdx, setIdx, 'weight', e.target.value)}
                            placeholder="kg / BW"
                            className="h-8 w-full text-sm font-semibold bg-[#FAFAF8] border border-[#EDE8E3] rounded-lg px-2 outline-none focus:border-[#E8B4A0] text-center"
                          />
                          <input
                            type="number"
                            min="0"
                            value={s.reps}
                            onChange={e => updateSet(exIdx, setIdx, 'reps', e.target.value)}
                            placeholder="reps"
                            className="h-8 w-full text-sm font-semibold bg-[#FAFAF8] border border-[#EDE8E3] rounded-lg px-2 outline-none focus:border-[#A0C4B8] text-center"
                          />
                          <button
                            onClick={() => removeSet(exIdx, setIdx)}
                            disabled={exLog.sets.length === 1}
                            className="w-7 h-8 flex items-center justify-center text-[#C8C0B8] hover:text-[#E24B4A] disabled:opacity-20 text-xs transition-colors"
                          >✕</button>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => addSet(exIdx)}
                      className="w-full py-2 border border-dashed border-[#EDE8E3] rounded-xl text-xs text-[#9A9087] hover:border-[#A0C4B8] transition-all"
                    >
                      + add set
                    </button>

                    {/* per-exercise notes */}
                    <input
                      value={exLog.notes}
                      onChange={e => updateExNote(exIdx, e.target.value)}
                      placeholder="Notes (e.g. form felt good, increased weight)"
                      className="w-full text-xs text-[#5A524A] bg-[#FAFAF8] border border-[#EDE8E3] rounded-xl px-3 py-2 outline-none focus:border-[#E8B4A0] placeholder:text-[#C8C0B8]"
                    />
                  </div>
                )
              })}

              {/* overall workout notes */}
              <div className="card">
                <p className="section-label">Workout notes</p>
                <textarea
                  value={workoutLog.notes ?? ''}
                  onChange={e => updateLog({ notes: e.target.value } as never)}
                  placeholder="How did this session feel? Energy, form, anything notable..."
                  rows={2}
                  className="w-full text-sm text-[#2A2520] bg-transparent outline-none resize-none placeholder:text-[#C8C0B8]"
                />
              </div>

              {!workoutLog.completed ? (
                <button
                  onClick={finishWorkout}
                  className="w-full py-4 bg-[#2A2520] text-[#F5EFE8] rounded-2xl font-semibold text-sm"
                >
                  Mark as complete ✓
                </button>
              ) : (
                <div className="bg-[#F3FAF8] border border-[#A0C4B8]/40 rounded-2xl p-5 text-center">
                  <div className="text-2xl mb-2">🎉</div>
                  <div className="font-semibold text-sm text-[#2A2520]">Workout complete!</div>
                  {workoutLog.duration > 0 && (
                    <div className="text-xs text-[#9A9087] mt-1">{workoutLog.duration} minutes</div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      )}

    </div>
  )
}