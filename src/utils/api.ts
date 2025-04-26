export const fetchTemplates = async () => {
  const response = await fetch('/api/morning/templates');
  if (!response.ok) {
    throw new Error('Failed to fetch templates');
  }
  return response.json();
};

export const saveTemplate = async (template: { title: string; tasks: string[] }) => {
  const response = await fetch('/api/morning/templates', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(template),
  });
  if (!response.ok) {
    throw new Error('Failed to save template');
  }
  return response.json();
};

export const fetchToDoList = async () => {
  const response = await fetch('/api/morning/todo');
  if (!response.ok) {
    throw new Error('Failed to fetch to-do list');
  }
  return response.json();
};

export const saveToDoList = async (toDoData: { date: string; tasks: { task: string; completed: boolean }[] }) => {
  const response = await fetch(`/api/morning/todo/${toDoData.date}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(toDoData),
  });
  if (!response.ok) throw new Error('Failed to save to-do list');
};

export const deleteToDoList = async (date: string) => {
  const response = await fetch(`/api/morning/todo/${date}`, { method: 'DELETE' });
  if (!response.ok) throw new Error('Failed to delete to-do list');
};

export const fetchcompletedRoutines = async () => {
  const response = await fetch('/api/morning/completed');
  if (!response.ok) {
    throw new Error('Failed to fetch completed routines');
  }
  return response.json();
};

export const saveCompletedRoutine = async (routine: { date: string; title: string; tasks: { task: string; completed: boolean }[] }) => {
  const response = await fetch('/api/morning/completed', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(routine),
  });
  if (!response.ok) throw new Error('Failed to save completed routine');
};

export const deleteCompletedRoutine = async (id: string) => {
  const response = await fetch(`/api/morning/completed/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete completed routine');
  }
};