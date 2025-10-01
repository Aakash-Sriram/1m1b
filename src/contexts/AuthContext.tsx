import React, { createContext, useContext } from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';

interface User {
  id: string;
  email?: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user: clerkUser, isLoaded } = useUser();
  const { signOut, openSignIn, openSignUp } = useClerk();

  // Transform Clerk user to your app's user format
  const user: User | null = clerkUser
    ? {
        id: clerkUser.id,
        email: clerkUser.primaryEmailAddress?.emailAddress,
        name: clerkUser.fullName || clerkUser.firstName || 'User',
      }
    : null;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const login = async (_email: string, _password: string) => {
    // For Clerk, we'll redirect to the sign-in modal
    // You can't directly login with email/password in the component
    // Instead, open Clerk's sign-in modal
    openSignIn();
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const signup = async (_email: string, _password: string, _name: string) => {
    // For Clerk, we'll redirect to the sign-up modal
    openSignUp();
  };

  const logout = async () => {
    await signOut();
  };

  const value: AuthContextType = {
    user,
    login,
    signup,
    logout,
    isLoading: !isLoaded,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
