"use client";

import { useState, useEffect } from "react";
import { ToDoListCard } from "@/components/ToDoListCard";
import { CompletedRoutineCard } from "@/components/CompletedRoutineCard";
import { TemplatesSection } from "@/components/TemplatesSection";
import {
  fetchTemplates,
  saveTemplate,
  fetchToDoList,
  fetchcompletedRoutines,
} from "@/utils/api";
import { SuccessAlert } from "@/components/my-alerts/SuccessAlert";
import { FailAlert } from "@/components/my-alerts/FailAlert";
import { v4 as uuidv4 } from "uuid"; // Import UUID library

export default function MorningRoutinePage() {
  const [templates, setTemplates] = useState<
    { title: string; tasks: string[] }[]
  >([]);
  const [toDoList, setToDoList] = useState<
    {
      id: string;
      date: string;
      tasks: { task: string; completed: boolean }[];
    }[]
  >([]);
  const [completedRoutines, setcompletedRoutines] = useState<
    {
      id: string; // Add id here
      date: string;
      title: string;
      tasks: { task: string; completed: boolean }[];
    }[]
  >([]);
  const [alert, setAlert] = useState<{
    type: "success" | "fail" | null;
    message: string;
  }>({ type: null, message: "" });

  const showAlert = (type: "success" | "fail", message: string) => {
    // Reset the alert state before showing a new alert
    setAlert({ type: null, message: "" });
    setTimeout(() => {
      setAlert({ type, message });
    }, 0);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const templatesData = await fetchTemplates();
        setTemplates(templatesData);

        const toDoListData = await fetchToDoList();
        setToDoList(toDoListData);

        const completedRoutinesData =
          await fetchcompletedRoutines();
        setcompletedRoutines(completedRoutinesData);
      } catch (error) {
        console.error("Error fetching data:", error);
        showAlert("fail", "Failed to fetch data. Please try again later.");
      }
    };

    fetchData();
  }, []);

  const handleSaveTemplate = async (template: {
    title: string;
    tasks: string[];
  }) => {
    try {
      const savedTemplate = await saveTemplate(template);
      setTemplates((prev) => [...prev, savedTemplate]);
      showAlert("success", "Template saved successfully!");
    } catch (error) {
      console.error("Error saving template:", error);
      showAlert("fail", "Failed to save template. Please try again.");
    }
  };

  const calculateProgress = (tasks: { task: string; completed: boolean }[]) => {
    const completedTasks = tasks.filter((task) => task.completed).length;
    return Math.round((completedTasks / tasks.length) * 100);
  };

  const handleAssignTemplate = async (template: {
    title: string;
    tasks: string[];
  }) => {
    const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
    const newToDoList = {
      id: uuidv4(), // Generate a unique ID
      date: today,
      tasks: template.tasks.map((task) => ({ task, completed: false })),
    };

    try {
      // Save the new To-Do list to the database
      const response = await fetch("/api/morning/todo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newToDoList),
      });

      if (!response.ok) {
        throw new Error("Failed to save To-Do list to the database.");
      }

      const savedToDoList = await response.json();

      // Update the local state with the saved To-Do list
      setToDoList((prev) => [...prev, savedToDoList]);
      showAlert("success", "Template assigned to today's to-do list!");
    } catch (error) {
      console.error("Error assigning template:", error);
      showAlert("fail", "Failed to assign template. Please try again.");
    }
  };

  const handleToggleTask = async (id: string, taskIndex: number) => {
    if (!id) {
      console.error("Error: Missing id for the To-Do list.");
      return;
    }

    const updatedToDoList = toDoList.map((list) => {
      if (list.id === id) {
        const updatedTasks = list.tasks.map((task, index) =>
          index === taskIndex ? { ...task, completed: !task.completed } : task
        );
        return { ...list, tasks: updatedTasks };
      }
      return list;
    });

    setToDoList(updatedToDoList);

    try {
      const response = await fetch(`/api/morning/todo/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tasks: updatedToDoList.find((list) => list.id === id)?.tasks,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update tasks in the database.");
      }

      showAlert("success", "Task updated successfully!");
    } catch (error) {
      console.error("Error updating task:", error);
      showAlert("fail", "Failed to update task. Please try again.");
    }
  };

  const handleCompleteRoutine = async (id: string) => {
    if (!id) {
      console.error("Error: Missing id for the To-Do list.");
      return;
    }
  
    const routineToComplete = toDoList.find((list) => list.id === id);
    if (!routineToComplete) {
      console.error("Error: To-Do list not found.");
      return;
    }
  
    try {
      const response = await fetch(`/api/morning/completed`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: routineToComplete.date,
          title: "Completed Routine",
          tasks: routineToComplete.tasks,
        }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to save completed routine.");
      }
  
      // Remove the completed routine from the To-Do list
      setToDoList((prev) => prev.filter((list) => list.id !== id));
      showAlert("success", "Routine marked as completed!");
    } catch (error) {
      console.error("Error completing routine:", error);
      showAlert("fail", "Failed to complete routine. Please try again.");
    }
  };

  const handleDeleteToDo = async (id: string) => {
    try {
      const response = await fetch(`/api/morning/todo/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete To-Do list from the database.");
      }

      setToDoList((prev) => prev.filter((list) => list.id !== id));
      showAlert("success", "To-Do list deleted successfully!");
    } catch (error) {
      console.error("Error deleting To-Do list:", error);
      showAlert("fail", "Failed to delete To-Do list. Please try again.");
    }
  };

  const handleDeleteRoutine = async (id: string) => {
    try {
      const response = await fetch(`/api/morning/completed/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(
          "Failed to delete completed routine from the database."
        );
      }

      setcompletedRoutines((prev) =>
        prev.filter((routine) => routine.id !== id)
      );
      showAlert("success", "Completed routine deleted successfully!");
    } catch (error) {
      console.error("Error deleting completed routine:", error);
      showAlert(
        "fail",
        "Failed to delete completed routine. Please try again."
      );
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Morning Routine</h1>

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

      {/* Templates Section */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Templates</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <TemplatesSection
            templates={templates}
            onAssignTemplate={handleAssignTemplate}
            onSaveTemplate={handleSaveTemplate}
          />
        </div>
      </div>

      {/* To-Do Lists */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">To-Do Lists</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {toDoList.map((list) => (
            <ToDoListCard
              key={list.id}
              id={list.id} // Ensure id is passed
              date={list.date}
              tasks={list.tasks}
              calculateProgress={calculateProgress}
              onToggleTask={handleToggleTask}
              onCompleteRoutine={handleCompleteRoutine}
              onDeleteToDo={handleDeleteToDo}
            />
          ))}
        </div>
      </div>

      {/* Completed Routines */}
      <div className="space-y-4 mt-8">
        <h2 className="text-xl font-bold">Completed Routines</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {completedRoutines.map((routine) => (
            <CompletedRoutineCard
              key={routine.id} // Ensure id is unique
              id={routine.id}
              date={routine.date}
              title={routine.title}
              tasks={routine.tasks}
              calculateProgress={calculateProgress}
              onDeleteRoutine={handleDeleteRoutine}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
