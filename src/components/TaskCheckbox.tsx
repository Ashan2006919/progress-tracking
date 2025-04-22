interface TaskCheckboxProps {
  task: { task: string; completed: boolean };
  onToggle?: () => void;
  readOnly?: boolean;
}

export function TaskCheckbox({ task, onToggle, readOnly = false }: TaskCheckboxProps) {
  return (
    <label className="flex items-center space-x-2">
      <input
        type="checkbox"
        checked={task.completed}
        onChange={onToggle}
        readOnly={readOnly}
        className="h-4 w-4"
      />
      <span>{task.task}</span>
    </label>
  );
}