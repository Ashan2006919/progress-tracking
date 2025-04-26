import { NextResponse } from 'next/server';
import clientPromise from '@/utils/mongodb';

// PUT: Update a to-do list for a specific date (id)
export async function PUT(request: Request, context: { params: { id: string } }) {
  const { id } = await context.params; // Await params before destructuring

  if (!id) {
    return NextResponse.json({ message: "Missing id parameter." }, { status: 400 });
  }

  try {
    const toDoData = await request.json();
    const client = await clientPromise;
    const database = client.db("progressTracker");
    const collection = database.collection("toDoListsMorning");

    const result = await collection.updateOne(
      { date: id },
      { $set: { tasks: toDoData.tasks } },
      { upsert: true }
    );

    return NextResponse.json({ message: "To-do list saved.", result }, { status: 200 });
  } catch (error) {
    console.error("Error saving to-do list:", error);
    return NextResponse.json({ message: "Failed to save to-do list." }, { status: 500 });
  }
}

// DELETE: Remove a to-do list for a specific date (id)
export async function DELETE(request: Request, context: { params: { id: string } }) {
  const { id } = await context.params; // Await params before destructuring

  if (!id) {
    return NextResponse.json({ message: "Missing id parameter." }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const database = client.db("progressTracker");
    const collection = database.collection("toDoListsMorning");

    const result = await collection.deleteOne({ date: id });

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: "To-do list not found." }, { status: 404 });
    }

    return NextResponse.json({ message: "To-do list deleted successfully." }, { status: 200 });
  } catch (error) {
    console.error("Error deleting to-do list:", error);
    return NextResponse.json({ message: "Failed to delete to-do list." }, { status: 500 });
  }
}
