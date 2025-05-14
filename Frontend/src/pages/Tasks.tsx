import React, { useState,useEffect } from "react";
import type { Task } from "../types/task";
import TaskBoard from "../components/TaskBoard";
import TaskModal from "../components/TaskModal";
import TaskForm from "../components/TaskForm";
import TaskFilters from "../components/TaskFilters";

const TasksPage: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([
      {
        id: "1",
        title: "Setup Firebase Auth",
        status: "To Do",
        priority: "High",
        assignee: "Chullu",
        dueDate: "2025-05-10",
        progress: 0,
        project: "Login System",
      },
      {
        id: "2",
        title: "Design Task Modal",
        status: "In Progress",
        priority: "Medium",
        assignee: "Shanu",
        dueDate: "2025-05-11",
        progress: 45,
        project: "UI",
      },
      {
        id: "3",
        title: "Backend API for tasks",
        status: "Done",
        priority: "Low",
        assignee: "Deepa",
        dueDate: "2025-05-08",
        progress: 100,
        project: "Backend",
      },
      {
        id: "4",
        title: "User Authentication with OAuth",
        status: "To Do",
        priority: "High",
        assignee: "Bhuvi",
        dueDate: "2025-06-01",
        progress: 0,
        project: "Login System",
      },
      {
        id: "5",
        title: "Design Task Card UI",
        status: "In Progress",
        priority: "Medium",
        assignee: "Raj",
        dueDate: "2025-05-15",
        progress: 60,
        project: "UI",
      },
      {
        id: "6",
        title: "Build Responsive Layout",
        status: "Done",
        priority: "Low",
        assignee: "Priya",
        dueDate: "2025-05-07",
        progress: 100,
        project: "UI",
      },
      {
        id: "7",
        title: "Implement Redux for State Management",
        status: "In Progress",
        priority: "High",
        assignee: "Gopi",
        dueDate: "2025-06-10",
        progress: 40,
        project: "State Management",
      },
      {
        id: "8",
        title: "Setup Continuous Integration",
        status: "To Do",
        priority: "Medium",
        assignee: "Vani",
        dueDate: "2025-06-05",
        progress: 0,
        project: "DevOps",
      },
      {
        id: "9",
        title: "Write Unit Tests for Task API",
        status: "In Progress",
        priority: "High",
        assignee: "Kumar",
        dueDate: "2025-06-12",
        progress: 25,
        project: "Backend",
      },
      {
        id: "10",
        title: "Document API Endpoints",
        status: "Done",
        priority: "Low",
        assignee: "Suresh",
        dueDate: "2025-05-06",
        progress: 100,
        project: "Documentation",
      },
    ]);
    
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [projectFilter,setProjectFilter] = useState("");

  const handleAddTask = (task: Task) => {
    const newTask = {
      ...task,
      id: (tasks.length + 1).toString(),
    };
    setTasks((prev) => [...prev, newTask]);
    setShowForm(false);
  };

  const filteredTasks = tasks.filter((task) => {
  const statusMatch = !statusFilter || task.status === statusFilter;
  const priorityMatch = !priorityFilter || task.priority === priorityFilter;
  const projectMatch = !projectFilter || task.project === projectFilter;
  return statusMatch && priorityMatch && projectMatch;
});

  return (
    <div className="p-8 w-full mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Tasks Board</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add Task
        </button>
      </div>

      <TaskFilters
        status={statusFilter}
        setStatus={setStatusFilter}
        priority={priorityFilter}
        setPriority={setPriorityFilter}
        project={projectFilter}
        setProject={setProjectFilter}
      />

      <TaskBoard tasks={filteredTasks} onSelectTask={(task) => setSelectedTask(task)} />

      {selectedTask && (
        <TaskModal task={selectedTask} onClose={() => setSelectedTask(null)} />
      )}

      {showForm && (
        <TaskForm onSubmit={handleAddTask} onClose={() => setShowForm(false)} />
      )}
    </div>
  );
};

export default TasksPage;