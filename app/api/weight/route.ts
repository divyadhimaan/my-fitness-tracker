import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { DB_NAME, WEIGHT_LOG_COL } from "@/lib/constants"

export async function GET() {
  const client = await clientPromise
  const docs = await client.db(DB_NAME).collection(WEIGHT_LOG_COL)
    .find({}).sort({ date: 1 }).toArray()
  return NextResponse.json(docs)
}

export async function POST(req: NextRequest) {
  const { date, weight } = await req.json()
  if (!date || !weight)
    return NextResponse.json({ error: 'date and weight required' }, { status: 400 })

  const client = await clientPromise
  await client.db(DB_NAME).collection(WEIGHT_LOG_COL).updateOne(
    { date },
    { $set: { date, weight: parseFloat(weight), updatedAt: new Date() } },
    { upsert: true }
  )
  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest) {
  const { date } = await req.json()
  if (!date) return NextResponse.json({ error: 'date required' }, { status: 400 })
  const client = await clientPromise
  await client.db(DB_NAME).collection(WEIGHT_LOG_COL).deleteOne({ date })
  return NextResponse.json({ ok: true })
}