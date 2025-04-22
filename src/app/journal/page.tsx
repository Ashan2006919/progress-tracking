'use client';

import { useState, useEffect } from 'react';
import JournalForm from '@/components/JournalForm';
import PastEntries from '@/components/PastEntries';

export default function JournalPage() {
  const [message, setMessage] = useState('');
  const [pastEntries, setPastEntries] = useState<{ date: string; entry: string }[]>([]);

  const handleSubmit = async (data: { date: Date; entry: string }) => {
    const journalData = { date: data.date.toISOString().split('T')[0], entry: data.entry };

    try {
      const response = await fetch('/api/journal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(journalData),
      });

      if (response.ok) {
        setMessage('Journal entry saved successfully!');
        fetchPastEntries(); // Refresh past entries
      } else {
        setMessage('Failed to save journal entry.');
      }
    } catch (error) {
      console.error('Error saving journal entry:', error);
      setMessage('An error occurred while saving the journal entry.');
    }
  };

  // Fetch past journal entries
  const fetchPastEntries = async () => {
    try {
      const response = await fetch('/api/journal', {
        method: 'GET',
      });

      if (response.ok) {
        const data = await response.json();
        setPastEntries(data.entries);
      } else {
        console.error('Failed to fetch past journal entries.');
      }
    } catch (error) {
      console.error('Error fetching past journal entries:', error);
    }
  };

  // Fetch past entries when the component loads
  useEffect(() => {
    fetchPastEntries();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Journal</h1>
      <p className="mb-4">This is the journal page where you can write your thoughts and reflections.</p>

      {/* Journal Form */}
      <JournalForm onSubmit={handleSubmit} />

      {message && <p className="text-green-500 mt-4">{message}</p>}

      {/* Past Entries */}
      <PastEntries entries={pastEntries} />
    </div>
  );
}
