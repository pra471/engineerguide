import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { supabase } from '../utils/supabaseClient';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<User | null>;
  signup: (email: string, password: string) => Promise<any>;
  resetPassword: (email: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is already logged in
    const session = supabase.auth.getSession();
    if (session) {
      setUser(session.user);
    }
    setIsLoading(false);
  }, []);

  const login = async (identifier: string, password: string): Promise<User | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: identifier.includes('@') ? identifier : undefined,
        password,
        ...(identifier.includes('@') ? {} : { email: undefined, password: undefined })
      });
      if (signInError) {
        setError(signInError.message);
        return null;
      }
      if (data.user) {
        setUser(data.user as any);
        return data.user as any;
      } else {
        setError('Invalid email or password');
        return null;
      }
    } catch (error) {
      setError('An error occurred during login');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string): Promise<any> => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });
      if (signUpError) {
        setError(signUpError.message);
        return null;
      }
      return data.user;
    } catch (error) {
      setError('An error occurred during signup');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email);
      if (resetError) {
        setError(resetError.message);
        return false;
      }
      return true;
    } catch (error) {
      setError('An error occurred during password reset');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, resetPassword, logout, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};