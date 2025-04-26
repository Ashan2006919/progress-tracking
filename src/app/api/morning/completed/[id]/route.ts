import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || '';
const client = new MongoClient(uri);

export async function DELETE(request: Request, context: { params: { id: string } }) {
  const { id } = context.params;

  if (!id) {
    return NextResponse.json({ message: 'Missing id parameter.' }, { status: 400 });
  }

  try {
    await client.connect();
    const database = client.db('progressTracker');
    const collection = database.collection('completedRoutines');

    const result = await collection.deleteOne({ id });

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: 'Routine not found.' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Routine deleted successfully.' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting routine:', error);
    return NextResponse.json({ message: 'Failed to delete routine.' }, { status: 500 });
  } finally {
    await client.close();
  }
}
