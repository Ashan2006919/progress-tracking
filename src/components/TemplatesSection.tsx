import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

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
  const [newTemplate, setNewTemplate] = useState<Template>({ title: "", tasks: [""] });

  const handleAddTask = () => {
    setNewTemplate((prev) => ({
      ...prev,
      tasks: [...prev.tasks, ""],
    }));
  };

  const handleTaskChange = (index: number, value: string) => {
    const updatedTasks = [...newTemplate.tasks];
    updatedTasks[index] = value;
    setNewTemplate((prev) => ({ ...prev, tasks: updatedTasks }));
  };

  const handleSaveTemplate = () => {
    onSaveTemplate(newTemplate);
    setNewTemplate({ title: "", tasks: [""] }); // Reset the form
  };

  return (
    <div className="space-y-4">
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
              onClick={() => onAssignTemplate(template)}
              className="mt-2 bg-blue-500 text-white"
            >
              Use Template
            </Button>
          </div>
        ))}
      </div>

      {/* Add Template Dialog */}
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
              value={newTemplate.title}
              onChange={(e) =>
                setNewTemplate((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="Template Title"
              className="mt-2"
            />
            <div className="space-y-2 mt-2">
              {newTemplate.tasks.map((task, index) => (
                <Input
                  key={index}
                  value={task}
                  onChange={(e) => handleTaskChange(index, e.target.value)}
                  placeholder={`Task ${index + 1}`}
                />
              ))}
            </div>
            <Button
              onClick={handleAddTask}
              className="mt-2 bg-gray-500 text-white"
            >
              Add Task
            </Button>
            <Button
              onClick={handleSaveTemplate}
              className="mt-2 bg-green-500 text-white"
            >
              Save Template
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}