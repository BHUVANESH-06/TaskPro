import { useState, useEffect } from 'react';
import { fetchMyProjects } from '../services/projectService';

export function useProjects() {
  const ownerId = localStorage.getItem("userId")
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!ownerId) return;

    setLoading(true);
    setError(null);

    fetchMyProjects(ownerId)
      .then(setProjects)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [ownerId]);

  return { projects, loading, error };
}
