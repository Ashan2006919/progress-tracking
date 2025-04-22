import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || '';
const client = new MongoClient(uri);

export async function POST(request: Request) {
  try {
    const template = await request.json();

    if (!template.title || !template.tasks || !Array.isArray(template.tasks)) {
      return NextResponse.json({ message: 'Invalid template data.' }, { status: 400 });
    }

    await client.connect();
    const database = client.db('progressTracker');
    const collection = database.collection('morningTemplates');

    const result = await collection.insertOne({
      title: template.title,
      tasks: template.tasks,
      createdAt: new Date(),
    });

    return NextResponse.json({ id: result.insertedId, ...template }, { status: 201 });
  } catch (error) {
    console.error('Error saving template:', error);
    return NextResponse.json({ message: 'Failed to save template.' }, { status: 500 });
  } finally {
    await client.close();
  }
}

export async function GET() {
  try {
    await client.connect();
    const database = client.db('progressTracker');
    const collection = database.collection('morningTemplates');

    const templates = await collection.find().toArray();

    return NextResponse.json(templates, { status: 200 });
  } catch (error) {
    console.error('Error fetching templates:', error);
    return NextResponse.json({ message: 'Failed to fetch templates.' }, { status: 500 });
  } finally {
    await client.close();
  }
}