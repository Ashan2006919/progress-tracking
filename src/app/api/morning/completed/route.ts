import { NextResponse } from 'next/server';
import clientPromise from '@/utils/mongodb'; // adjust path as needed

export async function POST(request: Request) {
  try {
    const completedRoutine = await request.json();

    if (!completedRoutine.date || !completedRoutine.tasks || !Array.isArray(completedRoutine.tasks)) {
      return NextResponse.json({ message: "Invalid completed routine data." }, { status: 400 });
    }

    const client = await clientPromise;
    const database = client.db("progressTracker");
    const collection = database.collection("completedRoutines");

    const result = await collection.insertOne({
      date: completedRoutine.date,
      title: completedRoutine.title || "Untitled Routine",
      tasks: completedRoutine.tasks,
      completedAt: new Date(),
    });

    return NextResponse.json({ id: result.insertedId, ...completedRoutine }, { status: 201 });
  } catch (error) {
    console.error("Error saving completed routine:", error);
    return NextResponse.json({ message: "Failed to save completed routine." }, { status: 500 });
  }
}

export async function GET() {
  try {
    const client = await clientPromise;
    const database = client.db('progressTracker');
    const collection = database.collection('completedRoutines');

    const completedRoutines = await collection.find().toArray();

    return NextResponse.json(completedRoutines, { status: 200 });
  } catch (error) {
    console.error('Error fetching completed routines:', error);
    return NextResponse.json({ message: 'Failed to fetch completed routines.' }, { status: 500 });
  }
}
