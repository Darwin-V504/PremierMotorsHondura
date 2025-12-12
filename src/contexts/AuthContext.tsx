import { createContext, useState, ReactNode, useContext } from 'react';

type User = {
  email: string;
  name: string;
} | null;

type AuthContextType = {
  user: User | null;
  isAllowed: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe estar dentro de AuthProvider');
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>(null);
  const [isAllowed, setIsAllowed] = useState<boolean>(false);

  const login = (email: string, password: string): boolean => {
    // Simulación de login - en producción conectar con backend
    const allowed = email.endsWith('.com') && password.length >= 6;
    if (allowed) {
      setUser({ email, name: email.split('@')[0] });
      setIsAllowed(allowed);
    }
    return allowed;
  };

  const logout = () => {
    setUser(null);
    setIsAllowed(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAllowed, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};