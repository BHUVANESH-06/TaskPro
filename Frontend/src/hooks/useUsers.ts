import { useState, useEffect } from 'react';
import { getUsers } from '../services/userService';

export const useUsers = () => {
  const [users, setUsers] = useState<{ id: string; name: string; email: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const usersData = await getUsers();
        setUsers(usersData);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return { users, loading, error };
};
