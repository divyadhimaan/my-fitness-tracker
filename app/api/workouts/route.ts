import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

const DB  = 'divya-fitness'
const COL = 'workout-logs'

export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get('date')
  const client = await clientPromise

  if (date) {
    const doc = await client.db(DB).collection(COL).findOne({ date })
    return NextResponse.json(doc ?? null)
  }

  const docs = await client.db(DB).collection(COL)
    .find({}).sort({ date: -1 }).toArray()
  return NextResponse.json(docs)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { date, ...rest } = body
  if (!date) return NextResponse.json({ error: 'date required' }, { status: 400 })

  const client = await clientPromise
  await client.db(DB).collection(COL).updateOne(
    { date },
    { $set: { date, ...rest, updatedAt: new Date() } },
    { upsert: true }
  )
  return NextResponse.json({ ok: true })
}