interface ProgressBarProps {
  progress: number;
  color?: string;
}

export function ProgressBar({ progress, color = 'bg-blue-500' }: ProgressBarProps) {
  return (
    <div className="w-full bg-gray-200 rounded-full h-4">
      <div className={`${color} h-4 rounded-full`} style={{ width: `${progress}%` }}></div>
    </div>
  );
}