import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

const DB = 'divya-fitness'
const COL = 'checkins'

export async function GET() {
  const client = await clientPromise
  const docs = await client.db(DB).collection(COL)
    .find({})
    .sort({ week: 1 })
    .toArray()
  return NextResponse.json(docs)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { week, ...data } = body
  if (week === undefined) return NextResponse.json({ error: 'week required' }, { status: 400 })

  const client = await clientPromise
  await client.db(DB).collection(COL).updateOne(
    { week },
    { $set: { week, ...data, updatedAt: new Date() } },
    { upsert: true }
  )
  return NextResponse.json({ ok: true })
}