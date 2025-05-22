import React, { useEffect, useState } from "react";
import type { Task } from "../types/task";
import type { Project } from "../pages/Projects";
import { useProjects } from "../hooks/myProject";
import { useProjectMembers } from "../hooks/projectMembers";
import { useCreateTask } from "../hooks/useCreateTask";

interface TaskFormProps {
  onSubmit: (task: Task) => void;
  onClose: () => void;
  initialTask?: Task;
}

const TaskForm: React.FC<TaskFormProps> = ({
  onSubmit,
  onClose,
  initialTask,
}) => {
  const [form, setForm] = useState<Task>(
    initialTask || {
      id: "",
      title: "",
      status: "TODO",
      priority: "MEDIUM",
      assignee: "",
      dueDate: "",
      progress: 0,
      projectId: "",
      description:""
    }
  );

  const [project, setProject] = useState<Project[]>([]);
  const { projects, loading, error } = useProjects();
  const { members, loading: membersLoading } = useProjectMembers(
    form.projectId
  );
  
  useEffect(() => {
    if (projects) {
      setProject(projects);
    }
  }, [projects]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };
  console.log(form)
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-[90%] max-w-lg"
      >
        <h2 className="text-xl font-bold mb-4">
          {initialTask ? "Edit Task" : "Add New Task"}
        </h2>

        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Task Title"
          className="w-full mb-3 p-2 border rounded"
          required
        />
        <input
          type="text"
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Task Description"
          className="w-full mb-3 p-2 border rounded"
          required
        />
        <div className="flex gap-3 mb-3">
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-1/2 p-2 border rounded"
          >
            <option>TODO</option>
            <option>IN_PROGRESS</option>
            <option>DONE</option>
          </select>

          <select
            name="priority"
            value={form.priority}
            onChange={handleChange}
            className="w-1/2 p-2 border rounded"
          >
            <option>HIGH</option>
            <option>MEDIUM</option>
            <option>LOW</option>
          </select>
          <select
            name="projectId"
            value={form.projectId}
            onChange={handleChange}
            className="w-full mb-3 p-2 border rounded"
            required
          >
            <option value="">Select Project</option>
            {project.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="block mb-1 font-medium">Assignee</label>
          {form.projectId ? (
            <select
              name="assignee"
              value={form.assignee}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="">Select Assignee</option>
              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name} ({member.email})
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              name="assignee"
              value={form.assignee}
              onFocus={() => {
                alert("Please select a project first");
              }}
              onChange={handleChange}
              placeholder="Select project first"
              className="w-full p-2 border rounded text-gray-400"
              disabled
            />
          )}
        </div>

        <input
          type="date"
          name="dueDate"
          value={form.dueDate}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
        />

        <input
          type="number"
          name="progress"
          value={form.progress}
          onChange={handleChange}
          placeholder="Progress %"
          className="w-full mb-3 p-2 border rounded"
          min={0}
          max={100}
        />

        <div className="flex justify-end gap-3 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-400 hover:bg-gray-500 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;
