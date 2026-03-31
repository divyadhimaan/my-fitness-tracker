import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

const DB = 'divya-fitness'
const COL = 'daily-logs'

export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get('date')
  if (!date) return NextResponse.json({ error: 'date required' }, { status: 400 })

  const client = await clientPromise
  const doc = await client.db(DB).collection(COL).findOne({ date })

  if (!doc) return NextResponse.json(null)

  // re-hydrate flat supplement keys back into object for the client
  const supplements: Record<string, boolean> = {}
  Object.keys(doc).forEach(k => {
    if (k.startsWith('supp_')) {
      supplements[k.replace('supp_', '')] = doc[k] as boolean
    }
  })

  return NextResponse.json({ ...doc, supplements })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { date, supplements, ...rest } = body
  if (!date) return NextResponse.json({ error: 'date required' }, { status: 400 })

  // flatten supplements → supp_multivitamin, supp_omega3, supp_vitaminD
  // so each is a visible top-level field in MongoDB instead of a nested object
  const flatSupplements: Record<string, boolean> = {}
  if (supplements && typeof supplements === 'object') {
    Object.entries(supplements).forEach(([k, v]) => {
      flatSupplements[`supp_${k}`] = v as boolean
    })
  }

  const client = await clientPromise
  await client.db(DB).collection(COL).updateOne(
    { date },
    { $set: { date, ...rest, ...flatSupplements, updatedAt: new Date() } },
    { upsert: true }
  )
  return NextResponse.json({ ok: true })
}