import { NextResponse } from 'next/server';
import { connectToDB } from '@/app/db/connect';
import { DailyLog } from '@/app/db/models/DailyLog';

export async function POST(req: Request) {
  try {
    await connectToDB();

    const body = await req.json();

    const {
      date,
      wakeUpTime,
      waterIntake,
      workout,
      danceTime,
      readingTime,
      meditationTime,
      reflection,
      noPMOStreak,
    } = body;

    const newLog = new DailyLog({
      date: new Date(date),
      wakeUpTime,
      waterIntake,
      workout,
      danceTime,
      readingTime,
      meditationTime,
      reflection,
      noPMOStreak,
    });

    await newLog.save();

    return NextResponse.json({ message: 'Log saved successfully' }, { status: 201 });
  } catch (error) {
    console.error('[LOG_SAVE_ERROR]', error);
    return NextResponse.json({ message: 'Failed to save log', error }, { status: 500 });
  }
}
