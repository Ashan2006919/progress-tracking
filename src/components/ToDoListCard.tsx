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

interface Task {
  task: string;
  completed: boolean;
}

interface ToDoListCardProps {
  id: string; // Add id prop
  date: string;
  tasks: Task[];
  calculateProgress: (tasks: Task[]) => number;
  onToggleTask: (date: string, taskIndex: number) => void;
  onCompleteRoutine: (date: string) => void;
  onDeleteToDo: (id: string) => void; // Use id instead of date
}

export function ToDoListCard({
  id,
  date,
  tasks,
  calculateProgress,
  onToggleTask,
  onCompleteRoutine,
  onDeleteToDo,
}: ToDoListCardProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="border rounded p-4 cursor-pointer">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">Date: {date}</h3>
            <Button
              onClick={(e) => {
                e.stopPropagation(); // Prevent triggering the dialog
                onDeleteToDo(id); // Use id to delete the specific To-Do list
              }}
              className="text-red-500 hover:text-red-700 bg-transparent"
              aria-label="Delete To-Do List"
            >
              <Trash2 className="h-8 w-8" />
            </Button>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
            <div
              className="bg-blue-500 h-4 rounded-full"
              style={{ width: `${calculateProgress(tasks)}%` }}
            ></div>
          </div>
          <p className="text-sm mt-2">
            {tasks.filter((task) => task.completed).length} of {tasks.length}{" "}
            tasks completed
          </p>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modify To-Do List</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {tasks.map((task, taskIndex) => (
            <TaskCheckbox
              key={taskIndex}
              task={task}
              onToggle={() => onToggleTask(id, taskIndex)} // Use id instead of date
            />
          ))}
          <div className="flex space-x-4 mt-4">
            <Button
              onClick={() => onCompleteRoutine(id)} // Use id instead of date
              className="bg-green-500 text-white"
            >
              Conclude
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
