// hooks/useDeleteProject.ts
import { useState } from 'react';
import { deleteProjectService } from '../services/projectService';

export const useDeleteProject = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const deleteProject = async (projectId: string) => {
    setLoading(true);
    setError(null);
    try {
      const success = await deleteProjectService(projectId);
      setLoading(false);
      return success;
    } catch (err: any) {
      setError(err);
      setLoading(false);
      throw err;
    }
  };

  return { deleteProject, loading, error };
};
