import { useEffect, useState } from 'react';
import { getInitialCollaborators } from '../services/projectService';
import type { Collaborator } from '../types/Collaborator';

export const useInitialCollaborators = (projectID: string) => {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!projectID) return;

    const fetchData = async () => {
      try {
        const data = await getInitialCollaborators(projectID);
        setCollaborators(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [projectID]);

  return { collaborators, loading, error };
};
