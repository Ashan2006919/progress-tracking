'use client';

import { useState, useEffect } from 'react';
import JournalForm from '@/components/JournalForm';
import PastEntries from '@/components/PastEntries';
import { SuccessAlert } from '@/components/my-alerts/SuccessAlert';
import { FailAlert } from '@/components/my-alerts/FailAlert';

export default function JournalPage() {
  const [pastEntries, setPastEntries] = useState<{ date: string; entry: string }[]>([]);
  const [alert, setAlert] = useState<{
    type: 'success' | 'fail' | null;
    message: string;
  }>({ type: null, message: '' });

  const showAlert = (type: 'success' | 'fail', message: string) => {
    // Reset the alert state before showing a new alert
    setAlert({ type: null, message: '' });
    setTimeout(() => {
      setAlert({ type, message });
    }, 0);
  };

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
        showAlert('success', 'Journal entry saved successfully!');
        fetchPastEntries(); // Refresh past entries
      } else {
        showAlert('fail', 'Failed to save journal entry.');
      }
    } catch (error) {
      console.error('Error saving journal entry:', error);
      showAlert('fail', 'An error occurred while saving the journal entry.');
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
        showAlert('fail', 'Failed to fetch past journal entries.');
      }
    } catch (error) {
      console.error('Error fetching past journal entries:', error);
      showAlert('fail', 'An error occurred while fetching past journal entries.');
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

      {/* Display Alerts */}
      <div className="fixed top-4 right-4 z-50">
        {alert.type === 'success' && (
          <SuccessAlert
            message={alert.message}
            onClose={() => setAlert({ type: null, message: '' })}
          />
        )}
        {alert.type === 'fail' && (
          <FailAlert
            message={alert.message}
            onClose={() => setAlert({ type: null, message: '' })}
          />
        )}
      </div>

      {/* Journal Form */}
      <JournalForm onSubmit={handleSubmit} />

      {/* Past Entries */}
      <PastEntries entries={pastEntries} />
    </div>
  );
}
