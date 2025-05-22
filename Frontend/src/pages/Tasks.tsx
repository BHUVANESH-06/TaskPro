import React, { useState, useEffect } from "react";
import type { Task } from "../types/task";
import TaskBoard from "../components/TaskBoard";
import TaskModal from "../components/TaskModal";
import TaskForm from "../components/TaskForm";
import TaskFilters from "../components/TaskFilters";
import { useCreateTask } from "../hooks/useCreateTask";
import { useTasksByAssignedTo } from "../hooks/tasksByAssignedTo";

const TasksPage: React.FC = () => {
  const userId = localStorage.getItem("userId") || "";
  console.log(userId)
  const [tasksState, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [projectFilter, setProjectFilter] = useState("");

  const { tasks, loading, error } = useTasksByAssignedTo(userId);
  const { createTask, loading: taskLoading, error: taskError } = useCreateTask();
  console.log(tasks)
  useEffect(() => {
    if (tasks) {
      console.log("HI")
      setTasks(tasks);
    }
  }, [tasks]);

  const handleAddTask = async (task: Task) => {
    try {
      const res = await createTask(
        task.title,
        task.description,
        task.dueDate,
        task.priority,
        task.projectId,
        task.status,
        task.assignee
      );
      console.log("Task created:", res);

      if (res) {
        console.log("Task created:", res);
        setTasks((prev) => [...prev, res]);
        setShowForm(false);
      } else {
        console.error("Task creation failed, not adding to list");
      }
    } catch (err) {
      console.error("Failed to create task", err);
    }
  };

  const filteredTasks = tasksState.filter((task) => {
    const statusMatch = !statusFilter || task.status === statusFilter;
    const priorityMatch = !priorityFilter || task.priority === priorityFilter;
    const projectMatch = !projectFilter || task.projectId === projectFilter;
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

      <TaskBoard
        tasks={filteredTasks}
        onSelectTask={(task) => setSelectedTask(task)}
        setTasks={setTasks}
      />

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
