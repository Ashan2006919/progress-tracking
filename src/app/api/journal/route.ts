import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || ''; // Ensure this is set in your .env.local file
const client = new MongoClient(uri);

export async function POST(request: Request) {
  try {
    const journalData = await request.json();

    if (!journalData.date || !journalData.entry) {
      return NextResponse.json({ message: 'Date and entry are required.' }, { status: 400 });
    }

    await client.connect();
    const database = client.db('progressTracker'); // Replace with your database name
    const collection = database.collection('journalEntries'); // Replace with your collection name

    await collection.insertOne({
      date: journalData.date,
      entry: journalData.entry,
      createdAt: new Date(),
    });

    return NextResponse.json({ message: 'Journal entry saved successfully!' }, { status: 201 });
  } catch (error) {
    console.error('Error saving journal entry:', error);
    return NextResponse.json({ message: 'Failed to save journal entry.' }, { status: 500 });
  } finally {
    await client.close();
  }
}

export async function GET() {
  try {
    await client.connect();
    const database = client.db('progressTracker');
    const collection = database.collection('journalEntries');

    const entries = await collection.find().sort({ createdAt: -1 }).toArray();

    return NextResponse.json({ entries }, { status: 200 });
  } catch (error) {
    console.error('Error fetching journal entries:', error);
    return NextResponse.json({ message: 'Failed to fetch journal entries.' }, { status: 500 });
  } finally {
    await client.close();
  }
}
