import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Event from '@/models/event';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { userId, name } = await req.json();

    if (!userId || !name ) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newEvent = new Event({
      userId,
      name,
      timestamp: new Date().toISOString(),
    });

    await newEvent.save();

    return NextResponse.json({ message: 'Event created successfully', event: newEvent }, { status: 201 });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
