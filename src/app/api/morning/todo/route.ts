import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || '';
const client = new MongoClient(uri);

export async function GET() {
  try {
    await client.connect();
    const database = client.db('progressTracker');
    const collection = database.collection('morningToDo');

    const toDoList = await collection.find().toArray();

    return NextResponse.json(toDoList, { status: 200 });
  } catch (error) {
    console.error('Error fetching to-do list:', error);
    return NextResponse.json({ message: 'Failed to fetch to-do list.' }, { status: 500 });
  } finally {
    await client.close();
  }
}

export async function POST(request: Request) {
  try {
    const toDoData = await request.json();

    if (!toDoData.date || !toDoData.tasks || !Array.isArray(toDoData.tasks)) {
      return NextResponse.json({ message: "Invalid to-do data." }, { status: 400 });
    }

    await client.connect();
    const database = client.db("progressTracker");
    const collection = database.collection("morningToDo");

    const result = await collection.insertOne({
      id: toDoData.id, // Save the unique ID
      date: toDoData.date,
      tasks: toDoData.tasks,
      createdAt: new Date(),
    });

    return NextResponse.json({ id: result.insertedId, ...toDoData }, { status: 201 });
  } catch (error) {
    console.error("Error saving to-do list:", error);
    return NextResponse.json({ message: "Failed to save to-do list." }, { status: 500 });
  } finally {
    await client.close();
  }
}

export async function PUT(request: Request) {
  try {
    const toDoData = await request.json();

    if (!toDoData.date || !toDoData.tasks || !Array.isArray(toDoData.tasks)) {
      return NextResponse.json({ message: 'Invalid to-do data.' }, { status: 400 });
    }

    await client.connect();
    const database = client.db('progressTracker');
    const collection = database.collection('morningToDo');

    const result = await collection.updateOne(
      { date: toDoData.date },
      { $set: { tasks: toDoData.tasks } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: 'To-do list not found.' }, { status: 404 });
    }

    return NextResponse.json({ message: 'To-do list updated successfully.' }, { status: 200 });
  } catch (error) {
    console.error('Error updating to-do list:', error);
    return NextResponse.json({ message: 'Failed to update to-do list.' }, { status: 500 });
  } finally {
    await client.close();
  }
}