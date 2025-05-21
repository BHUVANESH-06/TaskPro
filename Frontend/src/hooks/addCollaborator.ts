import { useState } from 'react';
import { addCollaborator as addCollaboratorService } from '../services/projectService';

export const useAddCollaborator = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addCollaborator = async (projectId: string, userId: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await addCollaboratorService(projectId, userId);
      return result;
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { addCollaborator, loading, error };
};