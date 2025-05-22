import { useEffect, useState } from "react";
import { fetchTasksByAssignedTo } from "../services/taskService";

export const useTasksByAssignedTo = (assignedToId: string) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!assignedToId) return;

    const loadTasks = async () => {
      try {
        const data = await fetchTasksByAssignedTo(assignedToId);
        setTasks(data);
      } catch (err: any) {
        console.log(err)
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, [assignedToId]);

  return { tasks, loading, error };
};
