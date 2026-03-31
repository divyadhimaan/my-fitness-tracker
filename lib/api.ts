export interface DayLog {
    date: string
    water: number
    meals: MealEntry[]
    supplements: Record<string, boolean>
    notes: string
    dayType: 'training' | 'rest'
  }
  
  export interface MealEntry {
    id: string
    label: string
    detail: string
    time: string
    done: boolean
  }
  
  export interface CheckinData {
    week: number
    weight: string
    waist: string
    hips: string
    chest: string
    rightArm: string
    rightQuad: string
    rightCalf: string
    workout: string
    diet: string
    notes: string
  }
  
  export async function fetchDayLog(date: string): Promise<DayLog | null> {
    const res = await fetch(`/api/logs?date=${date}`)
    if (!res.ok) return null
    return res.json()
  }
  
  export async function saveDayLog(log: DayLog): Promise<void> {
    await fetch('/api/logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(log),
    })
  }
  
  export async function fetchAllCheckins(): Promise<CheckinData[]> {
    const res = await fetch('/api/checkins')
    if (!res.ok) return []
    return res.json()
  }
  
  export async function saveCheckin(data: CheckinData): Promise<void> {
    await fetch('/api/checkins', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
  }

  export interface WeightEntry {
    date: string
    weight: number
  }
  
  export async function fetchWeightLog(): Promise<WeightEntry[]> {
    const res = await fetch('/api/weight')
    if (!res.ok) return []
    return res.json()
  }
  
  export async function saveWeightEntry(date: string, weight: number): Promise<void> {
    await fetch('/api/weight', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date, weight }),
    })
  }
  
  export async function deleteWeightEntry(date: string): Promise<void> {
    await fetch('/api/weight', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date }),
    })
  }

  export interface SetEntry {
    setNumber: number
    reps: string
    weight: string   // kg, or 'BW' for bodyweight
  }
  
  export interface ExerciseLog {
    name: string
    sets: SetEntry[]
    notes: string
  }
  
  export interface WorkoutLog {
    date: string
    day: string          // 'A' | 'B' | 'C' | 'D'
    phase: string        // 'phase1' | 'phase2'
    exercises: ExerciseLog[]
    duration: number     // minutes
    completed: boolean
  }
  
  export async function fetchWorkoutLog(date: string): Promise<WorkoutLog | null> {
    const res = await fetch(`/api/workouts?date=${date}`)
    if (!res.ok) return null
    return res.json()
  }
  
  export async function fetchAllWorkoutLogs(): Promise<WorkoutLog[]> {
    const res = await fetch('/api/workouts')
    if (!res.ok) return []
    return res.json()
  }
  
  export async function saveWorkoutLog(log: WorkoutLog): Promise<void> {
    await fetch('/api/workouts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(log),
    })
  }