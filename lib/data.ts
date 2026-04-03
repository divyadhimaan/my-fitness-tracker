// ─── TYPES ───────────────────────────────────────────────────────────────────
export interface Exercise {
  name: string
  sets: string
  note: string
  ytLink?: string
}

export interface DayWorkout {
  phase1: Exercise[]
  phase2: Exercise[]
}

export interface MealPlan {
  icon: string
  label: string
  content: string
}

export interface MealEntry {
  id: string
  label: string
  detail: string
  time: string
  done: boolean
}

export interface Supplement {
  key: string
  label: string
  dose: string
  icon: string
  daily: boolean
  weekly: boolean
}

export interface FoodGuide {
  label: string
  icon: string
  eat: string
  some: string
  less: string
}

export interface Tip {
  icon: string
  tip: string
}

export interface Measure {
  key: string
  label: string
  unit: string
  lowerIsBetter: boolean
}

// ─── CONSTANTS ───────────────────────────────────────────────────────────────
export const START_WEIGHT = 66.7
export const GOAL_WEIGHT = 59
export const WEEKS = 12
export const TARGET_AVG_LOSS = '0.5–0.8 kg'

// ─── PHASES ──────────────────────────────────────────────────────────────────
export const PHASES = [
  {
    id: 1, weeks: '1–3', label: 'Foundation',
    color: '#E8B4A0', bg: '#FDF6F3', textColor: '#C07050',
    desc: 'Relearn movement patterns. Use 60–70% of max weight. Perfect form over ego lifting. Rebuild mind-muscle connection.',
  },
  {
    id: 2, weeks: '4–7', label: 'Build',
    color: '#A0C4B8', bg: '#F3FAF8', textColor: '#3A8A72',
    desc: 'Progressive overload begins. Weights go up week over week. Cardio ramps to full 40-min HIIT. Push to RPE 8.',
  },
  {
    id: 3, weeks: '8–10', label: 'Intensify',
    color: '#A0AED4', bg: '#F3F5FC', textColor: '#4050A0',
    desc: 'Drop sets, supersets, higher volume. Fat loss accelerates. Every set at RPE 8.5–9. No shortcuts.',
  },
  {
    id: 4, weeks: '11–12', label: 'Peak',
    color: '#C4A0D4', bg: '#FAF3FC', textColor: '#8050A0',
    desc: 'Maximum intensity. Full trainer protocols across every session. Track every rep, every meal, every measurement.',
  },
]

// ─── MEASURES ─────────────────────────────────────────────────────────────────
export const MEASURES: Measure[] = [
  { key: 'waist',     label: 'Waist',  unit: 'in', lowerIsBetter: true  },
  { key: 'hips',      label: 'Hips',   unit: 'in', lowerIsBetter: true  },
  { key: 'chest',     label: 'Chest',  unit: 'in', lowerIsBetter: true  },
  { key: 'rightArm',  label: 'Arm',    unit: 'in', lowerIsBetter: false },
  { key: 'rightQuad', label: 'Quad',   unit: 'in', lowerIsBetter: false },
  { key: 'rightCalf', label: 'Calf',   unit: 'in', lowerIsBetter: false },
]

// ─── DASHBOARD STATUS MESSAGES ────────────────────────────────────────────────
export const STATUS_MESSAGES = [
  'No check-ins logged yet — get started!',
  'Week 1 complete — great start!', 'Foundation phase underway', 'Foundation phase complete!',
  'Building phase underway', 'Halfway there — keep pushing!', 'Build phase strong', 'Build phase done!',
  'Intensify phase — push harder!', 'Almost at peak!', 'Intensify phase complete!',
  'Final stretch — peak phase!', '12 weeks done — incredible!',
]


// ─── SPLIT ────────────────────────────────────────────────────────────────────
export const SPLIT = [
  { id: 'A', label: 'Push', muscles: 'Chest · Shoulders · Triceps', emoji: '💪', slug: 'push' },
  { id: 'B', label: 'Pull + Biceps', muscles: 'Back · Rear Delts · Biceps', emoji: '🔙', slug: 'pull' },
  { id: 'C', label: 'Legs + Glutes', muscles: 'Quads · Hamstrings · Glutes · Calves', emoji: '🦵', slug: 'legs' },
  { id: 'D', label: 'Cardio + Core', muscles: 'HIIT Walk · Abs · Active Recovery', emoji: '🔥', slug: 'cardio' },
]

// ─── WARMUP ───────────────────────────────────────────────────────────────────
export const WARMUP = [
  { name: 'March in Place', duration: '2 minutes', ytLink: 'https://www.youtube.com/shorts/M0VVKp94QTU' },
  { name: 'Arm Circles', duration: '30s clockwise + 30s anti-clockwise', ytLink: 'https://www.youtube.com/shorts/lzR7tzI1JUI' },
  { name: 'Leg Swings', duration: '15 each side', ytLink: 'https://www.youtube.com/shorts/NBcCNj1Spb0' },
  { name: 'Torso Twists', duration: '12 each side (24 total)', ytLink: 'https://www.youtube.com/shorts/CKJhSlc1L' },
  { name: 'Full Dynamic Warmup', duration: '5–8 minutes', ytLink: 'https://www.youtube.com/shorts/cGoyGQSMsIs' },
]

// ─── WORKOUTS ─────────────────────────────────────────────────────────────────
export const WORKOUTS: Record<string, DayWorkout> = {
  A: {
    phase1: [
      { name: 'Incline Dumbbell Press (30°)', sets: '2 warmup + 2×10', note: 'Light weight. Slow eccentric (3s down). Feel the chest contract.', ytLink: 'https://www.youtube.com/shorts/PGXDLiwBT1I' },
      { name: 'Machine Chest Press', sets: '1 warmup + 3×12', note: 'Controlled tempo. Full range of motion.', ytLink: 'https://www.youtube.com/shorts/hWbUlkb5Ms4' },
      { name: 'Pec Dec Fly', sets: '3×15', note: 'Moderate weight. Feel the stretch across the chest.', ytLink: 'https://www.youtube.com/shorts/g3T7LsEeDWQ' },
      { name: 'Dumbbell Lateral Raises', sets: '1 warmup + 3×12 @ 5kg', note: 'No swinging. Raise to ear-lobe height only. Constant tension.', ytLink: 'https://www.youtube.com/shorts/JIhbYYA1Q90' },
      { name: 'Rod Tricep Pushdowns', sets: '1 warmup + 2×12', note: 'Full extension. Rod to chin on the way up.', ytLink: 'https://www.youtube.com/shorts/WjLJ7zIppXQ' },
      { name: 'Treadmill Walk', sets: '15 min', note: 'Speed 5.5 · Incline 10' },
    ],
    phase2: [
      { name: 'Incline Dumbbell Press (30°)', sets: '2 warmup + 2×10 + 1 drop set', note: 'Explosive up, slow down. Contract and hold chest for 8s after each set.', ytLink: 'https://www.youtube.com/shorts/PGXDLiwBT1I' },
      { name: 'Machine Chest Press', sets: '1 warmup + 4×10–12', note: 'Heavier than Phase 1. Explosive up, controlled down.', ytLink: 'https://www.youtube.com/shorts/hWbUlkb5Ms4' },
      { name: 'Pec Dec Fly', sets: '2×8–10 (heavy) + 2×15', note: 'First two sets heavy, last two lighter. Focus on stretch and contraction.', ytLink: 'https://www.youtube.com/shorts/g3T7LsEeDWQ' },
      { name: 'Dumbbell Lateral Raises', sets: '1 warmup + 3×10–12 @ 7.5kg + 1×15 @ 5kg', note: 'Keep constant tension. No resting between reps.', ytLink: 'https://www.youtube.com/shorts/JIhbYYA1Q90' },
      { name: 'Rod Tricep Pushdowns', sets: '1 warmup + 3×10–12', note: 'Stretch at top, contraction at bottom. Rod to chin level up.', ytLink: 'https://www.youtube.com/shorts/WjLJ7zIppXQ' },
      { name: 'Cable Overhead Tricep Extensions', sets: '3×10–12', note: 'Full stretch at the top. Control throughout.', ytLink: 'https://www.youtube.com/shorts/Q3bO1Fh4734' },
      { name: 'Treadmill Walk', sets: '15 min', note: 'Speed 5.5–6 · Incline 10' },
    ],
  },
  B: {
    phase1: [
      { name: '1-Arm Lat Pulldowns', sets: '2×12 moderate', note: 'Pull through the elbow, not the hand. Squeeze back at bottom.', ytLink: 'https://www.youtube.com/shorts/wYy32uk4Bu8' },
      { name: 'Seated Machine Row', sets: '1 warmup + 3×10', note: 'Stretch and contract back. Minimize bicep involvement.', ytLink: 'https://www.youtube.com/shorts/fPbfYDgzIgA' },
      { name: 'Cable Pullovers', sets: '1 warmup + 3×12', note: 'Full stretch at top, contraction at bottom.', ytLink: 'https://www.youtube.com/shorts/1_E77qhMpkE' },
      { name: 'Reverse Pec Deck (Rear Delts)', sets: '3×18–20', note: 'Slightly bent elbows. Feel the rear delt squeeze.', ytLink: 'https://www.youtube.com/shorts/v0CxZlWX9zQ' },
      { name: 'EZ Bar Curls', sets: '1 warmup + 2×12', note: 'Strict form. No body swinging. No ego lifting.' },
    ],
    phase2: [
      { name: '1-Arm Lat Pulldowns', sets: '2×8 heavy + 2×15 moderate', note: 'Pull through elbow. Squeeze lats at the bottom.', ytLink: 'https://www.youtube.com/shorts/wYy32uk4Bu8' },
      { name: 'Seated Machine Row', sets: '1 warmup + 3×8–10', note: 'Heavier. Control the stretch and contraction throughout.', ytLink: 'https://www.youtube.com/shorts/fPbfYDgzIgA' },
      { name: 'Cable Pullovers', sets: '1 warmup + 4×12–15', note: 'Stretch at top, contraction at bottom.', ytLink: 'https://www.youtube.com/shorts/1_E77qhMpkE' },
      { name: 'Reverse Pec Deck (Rear Delts)', sets: '3×18–20', note: 'Slightly bent elbows. No momentum.', ytLink: 'https://www.youtube.com/shorts/v0CxZlWX9zQ' },
      { name: 'EZ Bar Curls', sets: '1 warmup + 3×12 (moderately heavy)', note: 'Strict form. No body swinging.' },
      { name: 'Incline Bench Dumbbell Curls', sets: '3×10–12 @ 5kg + drop to 2.5kg ×12', note: 'Drop set every set. Contraction at top, stretch at bottom.', ytLink: 'https://www.youtube.com/shorts/iwyO2nJuG5Y' },
      { name: 'Treadmill Walk', sets: '15 min', note: 'Speed 5.5–6 · Incline 10' },
    ],
  },
  C: {
    phase1: [
      { name: 'Goblet Squats', sets: '1 warmup + 3×12 @ 8kg', note: 'Slow down, explosive up. No knee lock at the top.', ytLink: 'https://www.youtube.com/shorts/eLX_dyvooKQ' },
      { name: 'Leg Press', sets: '1 warmup + 2×15', note: 'Slightly wider than shoulder width. Controlled and slow.', ytLink: 'https://www.youtube.com/shorts/ZOHxJ8dhrxc' },
      { name: 'Dumbbell RDLs', sets: '1 warmup + 2×12', note: 'Straight back. Knees slightly bent. Feel the hamstring stretch.', ytLink: 'https://www.youtube.com/shorts/dN_-PRqrQkA' },
      { name: 'Leg Extensions', sets: '2×15', note: 'Focus on quad contraction at the top.', ytLink: 'https://www.youtube.com/shorts/9icS_gPceJQ' },
      { name: 'Standing Calf Raises', sets: '3×12', note: 'Use elevated surface or two plates under each foot.' },
      { name: 'Treadmill Walk', sets: '15 min', note: 'Speed 5.5 · Incline 10' },
    ],
    phase2: [
      { name: 'Smith Machine Squats', sets: '1 warmup + 3×8–10', note: 'Go heavier. Explosive up, slow down. If lower back hurts, check form.', ytLink: 'https://www.youtube.com/shorts/xU4cuTffVZc' },
      { name: 'Leg Press', sets: '1 warmup + 2×20', note: 'Increase weight if 20 reps feels easy. Slow and controlled.', ytLink: 'https://www.youtube.com/shorts/ZOHxJ8dhrxc' },
      { name: 'Dumbbell RDLs', sets: '1 warmup + 2×10–12', note: 'Heavier than Phase 1. Keep back straight.', ytLink: 'https://www.youtube.com/shorts/dN_-PRqrQkA' },
      { name: 'Hip Thrusts', sets: '1 warmup + 3×10–12 with 10kg plates', note: 'Squeeze glutes hard at the top. Full range.', ytLink: 'https://www.youtube.com/shorts/W86oVlnLqY4' },
      { name: 'Bulgarian Split Squats', sets: '3×12 each side', note: 'No weight to start. Add weight from week 6+ if easy.', ytLink: 'https://www.youtube.com/shorts/DRPrZEP32fc' },
      { name: 'Walking Lunges', sets: '3×10 each leg', note: 'Controlled. Core tight throughout.', ytLink: 'https://www.youtube.com/watch?v=mAgbXQdd4LM' },
      { name: 'Calf Raises', sets: '4×12', note: 'Full range. Slow eccentric.', ytLink: 'https://www.youtube.com/shorts/nt9d_RmzNkI' },
    ],
  },
  D: {
    phase1: [
      { name: 'Treadmill HIIT Walk', sets: '30 min', note: '2 min walk @ speed 5.5/incline 8 → 2 min jog @ speed 8/incline 8. Repeat 7–8 cycles.' },
      { name: 'Cable Crunches', sets: '1 warmup + 3×12', note: 'Focus on crunching the abs, not pulling with arms.', ytLink: 'https://www.youtube.com/shorts/m4EL-IyXOj4' },
      { name: 'Leg Raises', sets: '3×as many as possible', note: 'Slow and controlled. No swinging.' },
      { name: 'Plank', sets: '2×max hold', note: '1.5–2 min rest between sets. Try to beat your time each week.' },
    ],
    phase2: [
      { name: 'Treadmill HIIT Walk', sets: '40 min', note: '2 min walk @ speed 5.5/incline 8 → 2 min jog @ speed 8–8.5/incline 8. Repeat 10 full cycles.' },
      { name: 'Cable Crunches', sets: '1 warmup + 4×12', note: 'Add small weight each week. Feel the abs, not the hip flexors.', ytLink: 'https://www.youtube.com/shorts/m4EL-IyXOj4' },
      { name: 'Leg Raises', sets: '4×as many as possible', note: 'Try to improve reps every session. Track your numbers.' },
      { name: 'Plank', sets: '2×max hold', note: 'Beat your time. Log it in check-in tab.' },
    ],
  },
}

// ─── DIET ─────────────────────────────────────────────────────────────────────
export const TRAINING_DAY_MEALS: MealPlan[] = [
  { icon: '🌅', label: 'Morning Drink', content: '500ml water + 50ml aloe vera juice + 10ml ACV (apple cider vinegar)' },
  { icon: '⚡', label: 'Pre-Workout (10 min before)', content: '1 tbsp coffee (6–8g) + 2 pinch salt + water. Can take salt separately.' },
  { icon: '💊', label: 'Supplements (with first meal)', content: '1 Multivitamin tablet (Naturaltein or MB Vite) + 1 serving Omega-3 (GNC Veg or Fish Oil)' },
  {
    icon: '🍳', label: 'Meal 1 — Post Workout', content: `Pick any one option:
• Bread Omelette: 2 brown bread + 4 egg whites + 1 whole egg + 5g oil/ghee. Add 200g salad (cucumber/beetroot/tomato/onion) or sautéed veggies.
• Protein Oats: 50g oats + 0.75 scoop chocolate whey + 20g dry fruits + half banana.
• 2 roti (low ghee) + daal/rajma/chhole 1 katori + 200g dahi. OR 2 roti + paneer sabzi.
• Besan Cheela (1–2) with 80g besan + veggies + 5ml oil.
• Besan Paneer Cheela: 50g besan + 80g paneer mixed well + veggies.`
  },
  {
    icon: '🥗', label: 'Meal 2 — Lunch (2–3pm)', content: `• 100g paneer/tofu salad with lots of veggies
• OR any option from Meal 1`
  },
  {
    icon: '🍉', label: 'Snack (Optional, 5–6pm)', content: `• 200g muskmelon / watermelon / 2 small bananas / 1 apple / 1 orange
• OR 250ml juice (prefer whole fruits for more fiber)`
  },
  { icon: '🌙', label: 'Meal 3 — Dinner', content: 'Same options as Meal 1. Choose based on what you feel like.' },
]

export const REST_DAY_MEALS: MealPlan[] = [
  { icon: '🌅', label: 'Morning Drink', content: '500ml water + 50ml aloe vera juice + 10ml ACV' },
  { icon: '⏰', label: 'Intermittent Fasting', content: 'First meal at 12:30–1pm. Before that: water, green tea, or black coffee only. This is your fat-burning window.' },
  {
    icon: '🍳', label: 'Meal 1 — 12:30–1pm', content: `Same options as training day Meal 1:
• Bread omelette with salad
• Protein oats
• Roti + daal/paneer
• Besan cheela
• Paneer/tofu salad with lots of veggies`
  },
  {
    icon: '🍉', label: 'Snack — 5–6pm', content: `• 300g muskmelon / watermelon / 2 bananas / 1 apple
• + Optional black coffee or low-calorie latte`
  },
  { icon: '🌙', label: 'Meal 2 — Dinner (8:30–9:30pm)', content: 'Same options as Meal 1. Eat the way you like it. Just no extra oil.' },
  { icon: '🧊', label: 'Cravings', content: 'Diet Coke / Coke Zero / Pepsi Black / GoZero ice cream. Black coffee or green tea for hunger. Eat more veggies — they\'re nearly zero calories.' },
]

// ─── CHECK-IN ─────────────────────────────────────────────────────────────────
export const CHECKIN_FIELDS = [
  { key: 'weight', label: 'Weight', unit: 'kg', icon: '⚖️' },
  { key: 'waist', label: 'Waist', unit: 'in', icon: '📏' },
  { key: 'hips', label: 'Hips', unit: 'in', icon: '📏' },
  { key: 'chest', label: 'Chest', unit: 'in', icon: '📏' },
  { key: 'rightArm', label: 'Right Arm', unit: 'in', icon: '💪' },
  { key: 'rightQuad', label: 'Right Quad', unit: 'in', icon: '🦵' },
  { key: 'rightCalf', label: 'Right Calf', unit: 'in', icon: '🦵' },
]

export const GOLDEN_RULES = [
  'All working sets at RPE 8.5–9. If it feels easy, add weight.',
  'Flex the muscle between every set — mind-muscle connection is everything.',
  'Film yourself monthly. Compare form and physique honestly.',
  'Weigh daily — fasted, after washroom, before eating (FAB protocol).',
  'Drink 4L water every single day. No exceptions.',
  'Rest 1.5–2 minutes between sets. Not more, not less.',
  'Stretch and cool down for 5 minutes after every workout.',
  'One small cheat meal per week is fine. Discuss with yourself first.',
]

export const MILESTONES = [
  { week: 'End of Week 3', goal: 'Form feels solid. Workouts stop feeling foreign.', weight: '~65 kg' },
  { week: 'End of Week 6', goal: 'Clothes feeling a little looser. Energy improving.', weight: '~63–64 kg' },
  { week: 'End of Week 9', goal: 'Visible change in waist and hips. Strength up significantly.', weight: '~61–62 kg' },
  { week: 'End of Week 12', goal: 'Strong, confident, fully self-sufficient as your own trainer.', weight: '~58–60 kg' },
]

// ─── DAILY LOGS ──────────────────────────────────────────────────────────────
export const DEFAULT_TRAINING_MEALS: MealEntry[] = [
  { id: 'morning', label: 'Morning drink', detail: '', time: 'On waking', done: false },
  { id: 'preworkout', label: 'Pre-workout coffee', detail: '', time: '10 min before', done: false },
  { id: 'meal1', label: 'Meal 1 — Post workout', detail: '', time: '', done: false },
  { id: 'meal2', label: 'Meal 2 — Lunch', detail: '', time: '2–3pm', done: false },
  { id: 'snack', label: 'Snack (optional)', detail: '', time: '5–6pm', done: false },
  { id: 'meal3', label: 'Meal 3 — Dinner', detail: '', time: 'Evening', done: false },
]

export const DEFAULT_REST_MEALS: MealEntry[] = [
  { id: 'morning', label: 'Morning drink', detail: '', time: 'On waking', done: false },
  { id: 'meal1', label: 'Meal 1 (break fast)', detail: '', time: '12:30–1pm', done: false },
  { id: 'snack', label: 'Snack', detail: '', time: '5–6pm', done: false },
  { id: 'meal2', label: 'Meal 2 — Dinner', detail: '', time: '8:30–9:30pm', done: false },
]

export const SUPPLEMENTS: Supplement[] = [
  { key: 'b12', label: 'B12', dose: '1 serving', icon: '+', daily: true, weekly: false },
  { key: 'vitaminD', label: 'Vitamin D', dose: '60,000 IU', icon: '☀️', daily: false, weekly: true },
]

export const MEAL_COLORS = ['#E8B4A0', '#A0AED4', '#A0C4B8', '#C4A0D4', '#E8B4A0', '#A0C4B8']

// ─── DIET GUIDES ─────────────────────────────────────────────────────────────
export const FOOD_GUIDES: FoodGuide[] = [
  {
    label: 'Carbs', icon: '🌾', eat: 'Oats, brown bread, roti, quinoa, sweet potato, fruits, beans & lentils',
    some: 'White rice, flavored yogurt, whole-grain crackers',
    less: 'White bread, crackers, sugary cereals, pastries, cookies, donuts',
  },
  {
    label: 'Protein', icon: '🥚', eat: 'Eggs & egg whites, paneer, tofu, fish, chicken, Greek yogurt, lentils & beans',
    some: 'Uncultured cottage cheese, tofu, edamame, lamb',
    less: 'Fried meats, protein bars, processed deli meats, high-fat sausages',
  },
  {
    label: 'Fats', icon: '🥑', eat: 'Olive oil, avocado, almonds, walnuts, peanut butter, seeds, olives',
    some: 'Coconut oil, dark chocolate, cream, flavored nut butters',
    less: 'Butter, margarine, sunflower oil, chips, fried food, trans fats',
  },
]

export const TIPS: Tip[] = [
  { icon: '🧂', tip: 'Salt & masalas are fine — they have minimal calories. Healthy can be tasty!' },
  { icon: '🍳', tip: 'Cook however you like — raw, grilled, boiled, sautéed. Just no extra oil beyond what\'s allocated.' },
  { icon: '🔄', tip: 'Club meals and switch them as needed. Just make sure you eat all meals on training days.' },
  { icon: '🥦', tip: 'Hungry? Eat more vegetables. They\'re nearly zero calories and very filling.' },
  { icon: '⏰', tip: 'Meal timings are flexible — adjust to when you\'re hungrier. Less in the morning, more at night is fine.' },
]
