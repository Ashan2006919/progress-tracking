"use client";

import { useState, useEffect } from "react";
import { ToDoListCard } from "@/components/ToDoListCard";
import { CompletedRoutineCard } from "@/components/CompletedRoutineCard";
import { TemplatesSection } from "@/components/TemplatesSection";
import {
  fetchTemplates,
  saveTemplate,
  fetchToDoList,
  fetchCompletedRoutines,
  deleteCompletedRoutine,
} from "@/utils/api";

export default function MorningRoutinePage() {
  const [templates, setTemplates] = useState<
    { title: string; tasks: string[] }[]
  >([]);
  const [toDoList, setToDoList] = useState<
    { date: string; tasks: { task: string; completed: boolean }[] }[]
  >([]);
  const [completedRoutines, setCompletedRoutines] = useState<
    {
      date: string;
      title: string;
      tasks: { task: string; completed: boolean }[];
    }[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const templatesData = await fetchTemplates();
        setTemplates(templatesData);

        const toDoListData = await fetchToDoList();
        setToDoList(toDoListData);

        const completedRoutinesData = await fetchCompletedRoutines();
        setCompletedRoutines(completedRoutinesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleSaveTemplate = async (template: { title: string; tasks: string[] }) => {
    try {
      const savedTemplate = await saveTemplate(template);
      setTemplates((prev) => [...prev, savedTemplate]);
    } catch (error) {
      console.error("Error saving template:", error);
    }
  };

  const calculateProgress = (tasks: { task: string; completed: boolean }[]) => {
    const completedTasks = tasks.filter((task) => task.completed).length;
    return Math.round((completedTasks / tasks.length) * 100);
  };

  const handleAssignTemplate = (template: {
    title: string;
    tasks: string[];
  }) => {
    const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
    const newToDoList = {
      date: today,
      tasks: template.tasks.map((task) => ({ task, completed: false })),
    };

    setToDoList((prev) => [...prev, newToDoList]);
  };

  const handleToggleTask = (date: string, taskIndex: number) => {
    setToDoList((prev) =>
      prev.map((list) =>
        list.date === date
          ? {
              ...list,
              tasks: list.tasks.map((task, index) =>
                index === taskIndex
                  ? { ...task, completed: !task.completed }
                  : task
              ),
            }
          : list
      )
    );
  };

  const handleCompleteRoutine = (date: string) => {
    const routineToComplete = toDoList.find((list) => list.date === date);
    if (routineToComplete) {
      setCompletedRoutines((prev) => [
        ...prev,
        {
          date: routineToComplete.date,
          title: "Completed Routine",
          tasks: routineToComplete.tasks,
        },
      ]);
      setToDoList((prev) => prev.filter((list) => list.date !== date));
    }
  };

  const handleDeleteToDo = (date: string) => {
    setToDoList((prev) => prev.filter((list) => list.date !== date));
  };

  const handleDeleteRoutine = async (date: string) => {
    try {
      await deleteCompletedRoutine(date);
      setCompletedRoutines((prev) =>
        prev.filter((routine) => routine.date !== date)
      );
      alert("Completed routine deleted successfully!");
    } catch (error) {
      console.error("Error deleting completed routine:", error);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Morning Routine</h1>

      {/* Templates Section */}
      <TemplatesSection
        templates={templates}
        onAssignTemplate={handleAssignTemplate}
        onSaveTemplate={handleSaveTemplate}
      />

      {/* To-Do Lists */}
      <div className="space-y-4 mt-8">
        <h2 className="text-xl font-bold">To-Do Lists</h2>
        {toDoList.map((list, index) => (
          <ToDoListCard
            key={index}
            date={list.date}
            tasks={list.tasks}
            calculateProgress={calculateProgress}
            onToggleTask={handleToggleTask}
            onCompleteRoutine={handleCompleteRoutine}
            onDeleteToDo={handleDeleteToDo}
          />
        ))}
      </div>

      {/* Completed Routines */}
      <div className="space-y-4 mt-8">
        <h2 className="text-xl font-bold">Completed Routines</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {completedRoutines.map((routine, index) => (
            <CompletedRoutineCard
              key={index}
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
