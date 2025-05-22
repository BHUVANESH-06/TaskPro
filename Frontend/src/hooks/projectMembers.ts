import { useEffect, useState } from 'react';
import { getProjectMembersService } from '../services/projectService';


export const useProjectMembers = (projectID: string) => {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const data = await getProjectMembersService(projectID);
        setMembers(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (projectID) {
      fetchMembers();
    }
  }, [projectID]);

  return { members, loading, error };
};
