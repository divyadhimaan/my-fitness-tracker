import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

const DB = 'divya-fitness'
const COL = 'daily-logs'

export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get('date')
  if (!date) return NextResponse.json({ error: 'date required' }, { status: 400 })

  const client = await clientPromise
  const doc = await client.db(DB).collection(COL).findOne({ date })
  return NextResponse.json(doc ?? null)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { date, ...data } = body
  if (!date) return NextResponse.json({ error: 'date required' }, { status: 400 })

  const client = await clientPromise
  await client.db(DB).collection(COL).updateOne(
    { date },
    { $set: { date, ...data, updatedAt: new Date() } },
    { upsert: true }
  )
  return NextResponse.json({ ok: true })
}