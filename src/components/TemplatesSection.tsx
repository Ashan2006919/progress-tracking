import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SuccessAlert } from "@/components/my-alerts/SuccessAlert";
import { FailAlert } from "@/components/my-alerts/FailAlert";

interface Template {
  title: string;
  tasks: string[];
}

interface TemplatesSectionProps {
  templates: Template[];
  onAssignTemplate: (template: Template) => void;
  onSaveTemplate: (template: Template) => void;
}

export function TemplatesSection({
  templates,
  onAssignTemplate,
  onSaveTemplate,
}: TemplatesSectionProps) {
  const [templateDraft, setTemplateDraft] = useState<Template>({
    title: "",
    tasks: [""],
  });

  const [alert, setAlert] = useState<{
    type: "success" | "fail" | null;
    message: string;
  }>({ type: null, message: "" });

  const showAlert = (type: "success" | "fail", message: string) => {
    setAlert({ type: null, message: "" });
    setTimeout(() => setAlert({ type, message }), 0);
  };

  const handleAddTask = () => {
    setTemplateDraft((prev) => ({
      ...prev,
      tasks: [...prev.tasks, ""],
    }));
  };

  const handleTaskChange = (index: number, value: string) => {
    const updatedTasks = [...templateDraft.tasks];
    updatedTasks[index] = value;
    setTemplateDraft((prev) => ({ ...prev, tasks: updatedTasks }));
  };

  const handleSaveTemplate = () => {
    if (!templateDraft.title.trim() || templateDraft.tasks.some(task => !task.trim())) {
      showAlert("fail", "Template must have a title and all tasks filled in.");
      return;
    }

    try {
      onSaveTemplate(templateDraft);
      setTemplateDraft({ title: "", tasks: [""] });
      showAlert("success", "Template saved successfully!");
    } catch (error) {
      console.error("Error saving template:", error);
      showAlert("fail", "Failed to save template. Please try again.");
    }
  };

  return (
    <div className="space-y-4">
      {/* Alerts */}
      <div className="fixed top-4 right-4 z-50">
        {alert.type === "success" && (
          <SuccessAlert message={alert.message} onClose={() => setAlert({ type: null, message: "" })} />
        )}
        {alert.type === "fail" && (
          <FailAlert message={alert.message} onClose={() => setAlert({ type: null, message: "" })} />
        )}
      </div>

      <h2 className="text-xl font-bold">Templates</h2>

      <div className="space-y-2">
        {templates.map((template, index) => (
          <div key={index} className="border rounded p-4">
            <h3 className="font-semibold">{template.title}</h3>
            <ul className="list-disc pl-5">
              {template.tasks.map((task, taskIndex) => (
                <li key={taskIndex}>{task}</li>
              ))}
            </ul>
            <Button
              onClick={() => {
                onAssignTemplate(template);
                showAlert("success", "Template assigned successfully!");
              }}
              className="mt-2 bg-blue-500 text-white"
            >
              Use Template
            </Button>
          </div>
        ))}
      </div>

      {/* Add New Template */}
      <Dialog>
        <DialogTrigger asChild>
          <Button className="mt-4 bg-green-500 text-white">Add New Template</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Template</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              value={templateDraft.title}
              onChange={(e) => setTemplateDraft((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Template Title"
            />
            <div className="space-y-2">
              {templateDraft.tasks.map((task, index) => (
                <Input
                  key={index}
                  value={task}
                  onChange={(e) => handleTaskChange(index, e.target.value)}
                  placeholder={`Task ${index + 1}`}
                />
              ))}
            </div>
            <Button onClick={handleAddTask} className="bg-gray-500 text-white">
              Add Task
            </Button>
            <Button onClick={handleSaveTemplate} className="bg-green-500 text-white">
              Save Template
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
