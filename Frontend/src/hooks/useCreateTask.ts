import { useState, useCallback } from "react";
import { taskService } from "../services/taskService";
import type { Task } from "../types/task";

export const useCreateTask = () => {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  const createTask = useCallback(async (
    title: string,
    description: string,
    dueDate: string,
    priority: string,
    projectId: string,
    status: string,
    assignedToId: string
  ): Promise<Task | null> => {
    setLoading(true);
    setError(null);

    try {
      const newTask = await taskService(
        title,
        description,
        dueDate,
        priority,
        projectId,
        status,
        assignedToId
      );
      return newTask;
    } catch (err: any) {
      setError(err.message || "Something went wrong creating the task");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { createTask, loading, error };
};