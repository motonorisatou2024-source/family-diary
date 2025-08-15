import { createContext } from 'react';
import { User } from './types';

export const AuthContext = createContext<{
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}>({
  user: null,
  login: async () => {},
  logout: () => {},
  isLoading: true,
});
