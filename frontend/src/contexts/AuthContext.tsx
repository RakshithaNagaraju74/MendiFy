// AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the AuthContext type
type AuthContextType = {
  sessionId: string | null;
  setSessionId: (sessionId: string | null) => void;
};

// Create the context with an initial null value
const AuthContext = createContext<AuthContextType | null>(null);

// AuthProvider component that wraps the app and provides context
type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [sessionId, setSessionId] = useState<string | null>(null);

  // Load sessionId from localStorage if available
  useEffect(() => {
    const savedSessionId = localStorage.getItem('sessionId');
    if (savedSessionId) {
      setSessionId(savedSessionId);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ sessionId, setSessionId }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to access AuthContext
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  // Ensure context is not null, otherwise throw error
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
