import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { TaskCheckbox } from "./TaskCheckbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MagicCard } from "@/components/magicui/magic-card";
import { useTheme } from "next-themes";

interface Task {
  task: string;
  completed: boolean;
}

interface CompletedRoutineCardProps {
  date: string;
  title: string;
  tasks: Task[];
  calculateProgress: (tasks: Task[]) => number;
  onDeleteRoutine: (date: string) => void;
}

export function CompletedRoutineCard({
  date,
  title,
  tasks,
  calculateProgress,
  onDeleteRoutine,
}: CompletedRoutineCardProps) {
  const { theme } = useTheme();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="p-0 max-w-sm w-full shadow-none border-none cursor-pointer">
          <MagicCard
            gradientColor={theme === "dark" ? "#262626" : "#D9D9D955"}
            className="p-0"
          >
            <CardHeader className="border-b border-border p-4 [.border-b]:pb-4">
              <CardTitle>{title}</CardTitle>
              <CardDescription>Date: {date}</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <div className="w-full bg-gray-200 rounded-full h-4 mt-4">
                <div
                  className="bg-green-500 h-4 rounded-full"
                  style={{ width: `${calculateProgress(tasks)}%` }}
                ></div>
              </div>
              <p className="text-sm mt-4">
                {tasks.filter((task) => task.completed).length} of {tasks.length} tasks completed
              </p>
            </CardContent>
            <CardFooter className="p-4 border-t border-border [.border-t]:pt-4 flex justify-between items-center">
              <Button
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteRoutine(date);
                }}
                className="text-red-500 hover:text-red-700"
                aria-label="Delete Completed Routine"
              >
                <Trash2 className="h-6 w-6" />
              </Button>
              <span className="text-gray-500">{calculateProgress(tasks)}%</span>
            </CardFooter>
          </MagicCard>
        </Card>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Completed Routine Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {tasks.map((task, taskIndex) => (
            <TaskCheckbox key={taskIndex} task={task} readOnly />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
