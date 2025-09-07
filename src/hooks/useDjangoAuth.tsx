import { createContext, useContext, useEffect, useState } from 'react';
import { apiClient } from '@/lib/api';

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  gender?: string;
  avatar?: string;
  avatar_url?: string;
  role: string;
  created_at: string;
  is_superuser?: boolean;
  is_staff?: boolean;
}

interface AuthContextType {
  user: User | null;
  userRole: string | null;
  signUp: (userData: any) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  loading: boolean;
  updateProfile: (profileData: any) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing token and fetch user profile
    const token = localStorage.getItem('access_token');
    if (token) {
      apiClient.setToken(token);
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await apiClient.getProfile();
      if (response.data) {
        setUser(response.data as any);
        setUserRole((response.data as any).role);
      } else {
        // Token might be invalid, clear it
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        apiClient.setToken(null);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      apiClient.setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (userData: any) => {
    const response = await apiClient.register(userData);
    
    if (response.data) {
      const { user: newUser, access, refresh } = response.data as any;
      setUser(newUser as any);
      setUserRole((newUser as any).role);
      apiClient.setToken(access as any);
      localStorage.setItem('refresh_token', refresh as any);
      return { error: null };
    }
    
    return { error: response.error };
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    const response = await apiClient.login({ email, password });
    
    if (response.data) {
      const { user: loggedInUser, access, refresh } = response.data as any;
      setUser(loggedInUser as any);
      setUserRole((loggedInUser as any).role);
      apiClient.setToken(access as any);
      localStorage.setItem('refresh_token', refresh as any);
      setLoading(false);
      return { error: null };
    }
    
    setLoading(false);
    return { error: response.error };
  };

  const signOut = async () => {
    setUser(null);
    setUserRole(null);
    apiClient.setToken(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  };

  const updateProfile = async (profileData: any) => {
    const response = await apiClient.updateProfile(profileData);
    
    if (response.data) {
      setUser(response.data as any);
      return { error: null };
    }
    
    return { error: response.error };
  };

  const value = {
    user,
    userRole,
    signUp,
    signIn,
    signOut,
    loading,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};