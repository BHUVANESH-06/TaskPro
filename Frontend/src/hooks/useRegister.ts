import { useState } from "react";
import { registerUser } from "../services/authService";
import type { User } from "../types/user";

export const useRegister = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = async (
    name: string,
    email: string,
    password: string
  ): Promise<User | null> => {
    try {
      setLoading(true);
      setError(null);
      const user = await registerUser(name, email, password);
      return user;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { register, loading, error };
};
