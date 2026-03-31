import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { DB_NAME, CHECKIN_COL } from "@/lib/constants"

export async function GET() {
  const client = await clientPromise
  const docs = await client.db(DB_NAME).collection(CHECKIN_COL)
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
  await client.db(DB_NAME).collection(CHECKIN_COL).updateOne(
    { week },
    { $set: { week, ...data, updatedAt: new Date() } },
    { upsert: true }
  )
  return NextResponse.json({ ok: true })
}