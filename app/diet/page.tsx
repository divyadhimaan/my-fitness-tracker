'use client'
import { useState } from 'react'
import { TRAINING_DAY_MEALS, REST_DAY_MEALS, FOOD_GUIDES, TIPS } from '@/lib/data'

export default function DietPage() {
  const [tab, setTab] = useState<'training' | 'rest'>('training')
  const [foodGuide, setFoodGuide] = useState<number | null>(null)
  const meals = tab === 'training' ? TRAINING_DAY_MEALS : REST_DAY_MEALS

  return (
    <div className="space-y-6 pt-2">

      {/* Toggle */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => setTab('training')}
          className={`py-3 rounded-xl text-sm font-semibold transition-all ${
            tab === 'training' ? 'bg-[#2A2520] text-[#F5EFE8]' : 'bg-[#F0EDE8] text-[#5A524A]'
          }`}
        >
          🏋️ Training Days
        </button>
        <button
          onClick={() => setTab('rest')}
          className={`py-3 rounded-xl text-sm font-semibold transition-all ${
            tab === 'rest' ? 'bg-[#2A2520] text-[#F5EFE8]' : 'bg-[#F0EDE8] text-[#5A524A]'
          }`}
        >
          🌿 Rest / Cardio Days
        </button>
      </div>

      {tab === 'rest' && (
        <div className="rounded-xl bg-[#F3FAF8] border border-[#A0C4B8]/30 px-4 py-3">
          <div className="font-semibold text-xs text-[#3A8A72] mb-1">⏰ Intermittent Fasting</div>
          <div className="text-xs text-[#5A8A7A]">Eating window: 12:30pm – 9:30pm. Before first meal: water, green tea, or black coffee only.</div>
        </div>
      )}

      {/* Meals */}
      <div className="space-y-3">
        {meals.map((meal, i) => (
          <div key={i} className="card">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{meal.icon}</span>
              <span className="font-semibold text-sm">{meal.label}</span>
            </div>
            <p className="text-xs text-[#5A524A] leading-relaxed whitespace-pre-line">{meal.content}</p>
          </div>
        ))}
      </div>

      {/* Supplements */}
      <div className="bg-[#2A2520] text-[#F5EFE8] rounded-2xl p-4 space-y-2">
        <p className="text-[10px] tracking-[2px] text-[#A0C4B8] uppercase mb-3">Hydration & Supplements</p>
        {[
          '💧 4L water daily — non-negotiable.',
          '☀️ 60,000 IU Vitamin D — once a month (from chemist).',
          '💊 1 Multivitamin daily — Naturaltein or MB Vite.',
          '🐟 1 Omega-3 serving with first meal — GNC Veg or Fish Oil.',
        ].map((s, i) => (
          <div key={i} className="text-sm flex gap-2">{s}</div>
        ))}
      </div>

      {/* Food Guide */}
      <div>
        <p className="section-label">Food Choices Guide</p>
        <div className="grid grid-cols-3 gap-2 mb-3">
          {FOOD_GUIDES.map((g, i) => (
            <button
              key={i}
              onClick={() => setFoodGuide(foodGuide === i ? null : i)}
              className={`rounded-xl p-3 text-center transition-all ${
                foodGuide === i ? 'bg-[#2A2520] text-[#F5EFE8]' : 'bg-[#F0EDE8] text-[#5A524A]'
              }`}
            >
              <div className="text-2xl">{g.icon}</div>
              <div className="text-xs font-semibold mt-1">{g.label}</div>
            </button>
          ))}
        </div>
        {foodGuide !== null && (
          <div className="card space-y-3">
            <div>
              <div className="text-xs font-bold text-[#3A8A72] mb-1">✅ Eat More</div>
              <p className="text-xs text-[#5A524A] leading-relaxed">{FOOD_GUIDES[foodGuide].eat}</p>
            </div>
            <div>
              <div className="text-xs font-bold text-[#C07050] mb-1">⚠️ Eat Some</div>
              <p className="text-xs text-[#5A524A] leading-relaxed">{FOOD_GUIDES[foodGuide].some}</p>
            </div>
            <div>
              <div className="text-xs font-bold text-red-500 mb-1">❌ Eat Less</div>
              <p className="text-xs text-[#5A524A] leading-relaxed">{FOOD_GUIDES[foodGuide].less}</p>
            </div>
          </div>
        )}
      </div>

      {/* FAQ Tips */}
      <div>
        <p className="section-label">Diet FAQs</p>
        <div className="space-y-2">
          {TIPS.map((t, i) => (
            <div key={i} className="card flex gap-3 items-start">
              <span className="text-xl">{t.icon}</span>
              <p className="text-xs text-[#5A524A] leading-relaxed">{t.tip}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recipe resources */}
      <div className="rounded-2xl bg-[#FFF8F0] border border-[#E8B4A0]/30 p-4">
        <p className="text-xs font-semibold text-[#C07050] mb-2">📺 Recipe Resources</p>
        <div className="space-y-1.5 text-xs text-[#5A524A]">
          <div>• <strong>YouTube:</strong> &quot;Mr BFit&quot; — Indian meal prep and high-protein recipes</div>
          <div>• <strong>YouTube:</strong> &quot;10 Easy High Protein Recipes&quot; cookbook</div>
          <div>• <strong>Instagram:</strong> @Raziyy — best for overnight oats (prep at night, grab in morning)</div>
        </div>
      </div>

    </div>
  )
}
