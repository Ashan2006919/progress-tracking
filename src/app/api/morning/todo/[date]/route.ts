import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || '';
const client = new MongoClient(uri);

export async function PUT(request: Request) {
  try {
    const { pathname } = new URL(request.url);
    const date = pathname.split('/').pop(); // Extract date from URL manually

    if (!date) {
      return NextResponse.json({ message: 'Missing date parameter.' }, { status: 400 });
    }

    const toDoData = await request.json();

    if (!toDoData.tasks || !Array.isArray(toDoData.tasks)) {
      return NextResponse.json({ message: 'Invalid to-do data.' }, { status: 400 });
    }

    await client.connect();
    const database = client.db('progressTracker');
    const collection = database.collection('morningToDo');

    const result = await collection.updateOne(
      { date },
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
