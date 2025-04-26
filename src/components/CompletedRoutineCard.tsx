import React, { useState } from "react";
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
import { SuccessAlert } from "@/components/my-alerts/SuccessAlert";
import { FailAlert } from "@/components/my-alerts/FailAlert";

interface Task {
  task: string;
  completed: boolean;
}

interface CompletedRoutineCardProps {
  id: string; // Add id to the props
  date: string;
  title: string;
  tasks: Task[];
  calculateProgress: (tasks: Task[]) => number;
  onDeleteRoutine: (id: string) => Promise<void>; // Use id instead of date
}

export function CompletedRoutineCard({
  id, // Destructure id here
  date,
  title,
  tasks,
  calculateProgress,
  onDeleteRoutine,
}: CompletedRoutineCardProps) {
  const { theme } = useTheme();
  const [alert, setAlert] = useState<{
    type: "success" | "fail" | null;
    message: string;
  }>({ type: null, message: "" });

  const showAlert = (type: "success" | "fail", message: string) => {
    setAlert({ type: null, message: "" });
    setTimeout(() => {
      setAlert({ type, message });
    }, 0);
  };

  const handleDelete = async () => {
    try {
      await onDeleteRoutine(id); // Use id instead of date
      showAlert("success", "Routine deleted successfully!");
    } catch (error) {
      console.error("Error deleting routine:", error);
      showAlert("fail", "Failed to delete routine. Please try again.");
    }
  };

  return (
    <>
      {/* Display Alerts */}
      <div className="fixed top-4 right-4 z-50">
        {alert.type === "success" && (
          <SuccessAlert
            message={alert.message}
            onClose={() => setAlert({ type: null, message: "" })}
          />
        )}
        {alert.type === "fail" && (
          <FailAlert
            message={alert.message}
            onClose={() => setAlert({ type: null, message: "" })}
          />
        )}
      </div>

      <Dialog>
        <DialogTrigger asChild>
          <Card className="p-0 max-w-md w-full shadow-none border-none cursor-pointer">
            <MagicCard
              gradientColor={theme === "dark" ? "#262626" : "#D9D9D955"}
              className="p-0"
            >
              <CardHeader className="border-b border-border p-4 [.border-b]:pb-4 flex items-center justify-between">
                <div>
                  <CardTitle>{title}</CardTitle>
                  <CardDescription>Date: {date}</CardDescription>
                </div>
                <Button
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(); // Ensure handleDelete uses id
                  }}
                  className="text-red-500 hover:text-red-700"
                  aria-label="Delete Completed Routine"
                >
                  <Trash2 className="h-6 w-6" />
                </Button>
              </CardHeader>
              <CardContent className="p-4">
                <div className="w-full bg-gray-200 rounded-full h-4 mt-4">
                  <div
                    className="bg-green-500 h-4 rounded-full"
                    style={{ width: `${calculateProgress(tasks)}%` }}
                  ></div>
                </div>
                <p className="text-sm mt-4">
                  {tasks.filter((task) => task.completed).length} of{" "}
                  {tasks.length} tasks completed
                </p>
              </CardContent>
              <CardFooter className="p-4 border-t border-border [.border-t]:pt-4 flex justify-between items-center">
                <span className="text-gray-500">
                  {calculateProgress(tasks)}%
                </span>
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
    </>
  );
}
